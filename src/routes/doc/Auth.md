## Content
1. Registration
2. Login

Back to [README](../../../README.md)

# 1. Registration
Creates a new user.

**URL** : `/register`

**Method** : `POST`

**DATA** :
```json
{
    "email": "joe25@example.com",
    "password": "IAmSecure",
    "firstName": "Joe",
    "lastName": "Example"
}
```


**Auth required** : NO

## Success Response

**Code** : `201 Created`

**Content examples**

For a User on the local database that just got created.

```json
{
    "data": { "message": "User successfully registered." }
}
```

   
# 2. Login
Lets the user login for authentication purpesess.

**URL** : `/login`

**Method** : `POST`

**DATA** :
```json
{
    "email": "joe25@example.com",
    "password": "IAmSecure",
}
```


**Auth required** : NO

## Success Response

**Code** : `200 OK`

**Content examples**

For a User on the local database just logged in.

```json
{
    "data": {
        "message": "User logged in",
        "user":
        {
            "id": 1,
            "email": "joe25@example.com",
            "first_name": "Joe",
            "last_name": "Example",
            "assets": 0.00
        },
        "token": "{Your JWT user Token}"
    }
}
```