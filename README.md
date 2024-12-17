# OTV (Tube-Hacked)

Brute-force simulator exercise.

Participants compete to guess the secret code. If successful, the video will change and the code
will be randomized again.

## getting started

1. clone and change directory into project
1. `$ npm install`
1. `$ npm start`
1. `open localhost:8081`
1. press play

## API

There's only one endpoint `/otv` which accepts post requests with a urlencoded or json encoded body.

### Request

The server supports urlencoded and json type body content.

example payload in json
```json
{
    "username": "z3r0cooL",
    "code": 123,
    "video_id": "c0-hvjV2A5Y"
}
```

**username**
This can be anything just to identify yourself on the server and in the UI.

**video_id**
The id of the video you want to play.
it's the `v` parameter of a youtube url.
For example, if the youtube video you want to play is
`https://www.youtube.com/watch?v=c0-hvjV2A5Y` then the `video_id` is `c0-hvjV2A5Y`

**code**
A decimal number representing your guess.
If this matches the secret code on the server, then the video you want will be played.

### Response

`/otv` will respond with a json response:

```json
{
  "success": false,
  "message": "Unauthorized Access."
}
```

or success: true if your code is correct.
