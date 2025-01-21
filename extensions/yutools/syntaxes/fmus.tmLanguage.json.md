{
  "scopeName": "source.fmus",
  "fileTypes": ["fmus"],
  "patterns": [
    {
      "name": "meta.marker.start.fmus",
      "match": "^--%.*$"
    },
    {
      "name": "meta.marker.end.fmus",
      "match": "^--#.*$"
    },
    {
      "include": "text.html.markdown"
    },
    {
      "name": "comment.block.fmus",
      "begin": "^--%",
      "end": "^--#",
      "patterns": [
        { "include": "text.html.markdown" }
      ]
    },
    {
      "name": "keyword.control.fmus",
      "match": "\\bDF\\b"
    },
    {
      "name": "entity.name.tag.fmus",
      "match": "<[a-zA-Z0-9_]+"
    },
    {
      "name": "entity.name.tag.close.fmus",
      "match": "</[a-zA-Z0-9_]+>"
    },
    {
      "name": "string.quoted.double.fmus",
      "match": "\".*?\""
    },
    {
      "name": "comment.line.double-slash.fmus",
      "match": "//.*$"
    }
  ],
  "repository": {},
  "uuid": "e5d0afea11b2a99b3e850e2420102a853d6202848a45afe7b4cadfe479db817c"
}
