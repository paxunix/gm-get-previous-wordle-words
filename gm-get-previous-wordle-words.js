// In your greasemonkey script you need to:
// @grant GM.xmlHttpRequest

const previousWordsUrl = "https://wordfinder.yourdictionary.com/wordle/answers/";

async function fetcher(opts)
{
    "use strict";

    return new Promise((res, rej) => {
        opts.headers = opts.headers || {};
        opts.headers.Accept = opts.headers.Accept || "*/*";
        opts.method = opts.method || "GET";
        opts.onload = response => {
            if (response.status >= 200 && response.status < 300)
            {
                res(response);
            }
            else
            {
                rej({
                    status: response.status,
                    statusText: `${response.statusText} retrieving ${opts.url}`
                });
            }
        };
        opts.onerror = response => {
            rej({
                status: response.status,
                statusText: `${response.statusText} retrieving ${opts.url}`
            });

        };

        return GM.xmlHttpRequest(opts);
    });
}


async function getPreviousWordleWords()
{
    "use strict";

    let doc = (await fetcher({
		url: previousWordsUrl,
		responseType: "document"
	})).response;
    let rows = Array.from(doc.querySelectorAll('tr'))
        .filter(tr => {
            let el = tr.querySelector('td:nth-child(3)');
            return el ? el.innerText.search(/^\s*\w+\s*$/) !== -1 : false;
        });

    if (rows.length === 0)
        throw new Error("Failed to find previous word list.  Selector needs updating?");

    let words = rows.map(tr => {
        let h2 = tr.closest("table")?.previousElementSibling;
        if (h2.nodeName !== "H2")
            throw new Error("Can't find expected h2");

        let year = h2.innerText.match(/(\d+)/)[0];

        let [date, number, word] = Array.from(tr.querySelectorAll("td")).map(td => td.textContent?.trim() ?? "");

        date = (new Date(`${date} ${year}`)).toISOString().split("T")[0];
        number = parseInt(number, 10);
        word = word.toUpperCase();

        return {
            date,
            number,
            word,
        }
    });

    // order from newest to oldest
    words.sort((a, b) => b.date.localeCompare(a.date, "en-US"));

	return words;
}
