GreaseMonkey library script to retrieve the list of previous Wordle words
=========================================================================

`getPreviousWordleWords()` will return a list of the previous Wordle words,
retrieved from some other website.

Each element in the list is of the form:

```JavaScript
{
    date: "<YYYY-MM-DD>",   // date of the Wordle solution
    number: <integer>,      // which Wordle puzzle it is
    word: <string>,         // the uppercase Wordle solution word
}
```

At the top of the script, find which `@grant` directives will be needed in
your script that includes this one.
