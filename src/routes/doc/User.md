## Content
1. Get User Assets
2. Update User Assets

Back to [README](../../../README.md)

# 1. Get Assets
Makes a request to get the users current account assets.

**URL** : `/user/assets`

**Method** : `GET`

**DATA** :
```json
{}
```

**Auth required** : YES  
**Header**: `{ "x-access-token": "Your JTW Token" }`

## Success Response

**Code** : `200 OK`

**Content examples**

For a User that requests his or hers data.

```json
{
    "data":
    {
        "id": 1,
        "assets": 10.55
    }
}
```

# 2. Update assets
Lets the add or remove assets from his or her account

**URL** : `/user/assets`

**Method** : `POST`

**DATA** :
```json
{}
```


**Auth required** : YES  
**Header**: `{ "x-access-token": "Your JTW Token" }`

## Success Response

**Code** : `202 Accepted`

**Content examples**

For a User that requests his or hers data.

```json
{
    "data":
    {
        "message": "Assets sucsessfully updated"
    }
}
```
