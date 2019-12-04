# Models

## Users App

User:
- email
- password
- first_name
- last_name

Profile:
- picture

## Teams App

Team:
- name
- hash
- admins: User[]
- is_hidden

Member:
- name
- token
- team
- user (nullable, default=null)

## Goals App

Goal:
- created_at
- created_by
- description
- member
- status (choices=[NOT_DONE, IN_PROGRESS, DONE], nullable, default=None)
- set_done_at (nullable, default=null)
- set_in_progress_at (nullable, default=null)
- set_not_done_at (nullable, default=null)
- is_archived
- modified_at


# API

## Users

### Login

POST /users/login/

Body:
{
  "email": "adolfo@asdasd.com",
  "password":
}

Response:
{
  "token": "ASDAS@#$#@ED@#@#RQW",
  "user": {
    "id": 123213,
    "first_name": "asdadasd",
    "last_name": "asdasdasd"
    "email": "asdasd@asdasd.com",
    "profile":{
      ...
    }
  }
}

## Teams

### List my teams

GET /teams/

No body

Response:
{
  count: xxxx,
  prev: xxxx,
  next: xxxx,
  results: [
    ...
    {
      "id": 123,
      "name": "Daily",
      "hash": "ASDAS@#WEW$#FASF"
    },
    ...
  ]
}

### Create team

POST /teams/

Body
{
  "name": "adasdasd"
}

Response:
{
  "id": 123,
  "name": "Daily",
  "hash": "ASDAS@#WEW$#FASF"
}

### Get team

GET /teams/<id>/

No body

Response:
{
  "id": 123,
  "name": "Daily",
  "hash": "ASDAS@#WEW$#FASF"
  "members": [
    ...
    {
      "id": 12312,
      "name": "Pedro",
      "goals": [
        ...
        {
          "id": 123123,
          "description": "asdasdasd",
          "created_at": "2019-12-12T23:23:22.023Z",
          "status": "NOT_DONE"
        },
        ...
      ]
    },
    ...
  ]
}

### Create member for team

POST /teams/<id>/members/

Body
{
  "name": "Ricardo"
}

Response:
{
  "id": 123,
  "name": "Ricardo"
}

## Goals

### Create a goal for member

POST /goals/

Body
{
  "member": 12321,
  "description": "aSDASDAS asdASdasds asdasdasd asd"
}

Response
{
  "id": 123123,
  "description": "aSDASDAS asdASdasds asdasdasd asd",
  "created_at": "2019-12-12T23:23:22.023Z",
  "status": null
}

### Update goal status

PUT /goals/<id>/status/

Body
{
  "status": "DONE"
}

### Update goal description

PUT /goals/<id>/

Body
{
  "description": "dasdasd asdasd asdasd asd"
}

### Archive goal

PUT /goals/<id>/

Body
{
  "is_archived": true
}
