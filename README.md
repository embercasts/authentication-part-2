## Embercast: Client-side Authentication, Part 2

This two-part series on client-side authentication focuses on how you
can configure your single-page Ember app to query data from the server
using token-based authentication. 

This second part focuses mainly on how to make use of redirects,
saved/retryable transitions, and async error handling features
available on the Ember Router to build out the rest of a simple
authenticated app.

## Install

Clone this repository, and in the new directory, run:

    npm install
    node server.js

This will run a Node server on `localhost:3000` that you can visit in
your browser.

## Structure

`server.js` in the root directory is the Node server that features
very simple token-based authentication. 

`public/js/app.js` is where all Ember code for this Embercast resides.

