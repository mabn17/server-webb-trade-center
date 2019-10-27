## Content
1. Get User Assets
2. Update User Assets
3. Sell Stocks
3. Buy Stocks

Back to [README](../../../README.md)

# 1. Get Assets
Makes a request to get the user account details.

**URL** : `/user/self`

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

For a User that requests his or her data.

```json
{
    "data":
    {
        "id": 1,
        "email": "joe25@example.com",
        "first_name": "Joe",
        "last_name": "Example",
        "assets": 10.55
    }
}
```

# 2. Update assets
Lets the add assets from his or her account

**URL** : `/user/update/assets`

**Method** : `POST`

**DATA** :
```json
{
  "newAmount": 10.2 // Amount to add
}
```


**Auth required** : YES  
**Header**: `{ "x-access-token": "Your JTW Token" }`

## Success Response

**Code** : `202 Accepted`

**Content examples**

For a User that requests his or hers data.

```json
{
    "data": "Your new amount has been placed"
}
```

# 3. Sell Stocks
Lets the user sell stocks.

**URL** : `/user/stocks/sell`

**Method** : `POST`

**DATA** :
```json
{
  "stockToSell": "Gold", // Name of the stock
  "amountToSell": 2      // Number of stocks to sell
}
```


**Auth required** : YES  
**Header**: `{ "x-access-token": "Your JTW Token" }`

## Success Response

**Code** : `200 OK`

**Content examples**

The reponse

```json
{
    "data":
    {
        "message": "Stocks sucsessfully sold"
    }
}
```

# 3. Sell Stocks
Lets the user buy stocks.

**URL** : `/user/stocks/buy`

**Method** : `POST`

**DATA** :
```json
{
  "stockToBuy": "Gold", // Name of the stock
  "amountToBuy": 2      // Number of stocks to sell
}
```


**Auth required** : YES  
**Header**: `{ "x-access-token": "Your JTW Token" }`

## Success Response

**Code** : `201 CREATED`

**Content examples**

The reponse

```json
{
    "message": "Stocks has been updated."
}
```
