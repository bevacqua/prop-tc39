# prop-tc39

> Scraping microservice for TC39 proposals 😸

# Website

- [`/`][web]: Serves an HTML page with every proposal in the TC39 pipeline.
- [`/finished`][web-finished]: Serves an HTML page with stage 4 proposals in the TC39 pipeline.
- [`/active`][web-active]: Serves an HTML page with stage 1, stage 2, and stage 3 proposals in the TC39 pipeline.
- [`/proposed`][web-proposed]: Serves an HTML page with stage 0 proposals in the TC39 pipeline.

# Web API

- [`/proposals`][web-proposals]: Returns a JSON object with every proposal in the TC39 pipeline.
- [`/proposals/finished`][web-proposals-finished]: Returns a JSON object with stage 4 proposals in the TC39 pipeline.
- [`/proposals/active`][web-proposals-active]: Returns a JSON object with stage 1, stage 2, and stage 3 proposals in the TC39 pipeline.
- [`/proposals/proposed`][web-proposals-proposed]: Returns a JSON object with stage 0 proposals in the TC39 pipeline.

# Package API

- `prop.fetchAll(done)` - Invokes `done(err, proposals)` with every proposal in the TC39 pipeline.
- `prop.fetchFinished(done)` - Invokes `done(err, proposals)` with stage 4 proposals in the TC39 pipeline.
- `prop.fetchActive(done)` - Invokes `done(err, proposals)` with stage 1, stage 2, and stage 3 proposals in the TC39 pipeline.
- `prop.fetchProposed(done)` - Invokes `done(err, proposals)` with stage 0 proposals in the TC39 pipeline.

# Screenshot

[![][screenshot]][web]

# License

MIT

[screenshot]: https://github.com/bevacqua/prop-tc39/blob/master/screenshot.png
[web]: https://prop-tc39.now.sh/
[web-finished]: https://prop-tc39.now.sh/finished
[web-active]: https://prop-tc39.now.sh/active
[web-proposed]: https://prop-tc39.now.sh/proposed
[web-proposals-finished]: https://prop-tc39.now.sh/proposals/finished
[web-proposals-active]: https://prop-tc39.now.sh/proposals/active
[web-proposals-proposed]: https://prop-tc39.now.sh/proposals/proposed
