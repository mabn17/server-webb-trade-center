## Content
1. Get all of the current stocks
2. Gets the stock history
3. Update all stock prices
4. Update stocks (with socket emit)
5. Gets a list of all stocks a user owns

Back to [README](../../../README.md)


# 1. Get all of the current stocks
Displays a list of all current stocks

**URL** : `/stocks`

**Method** : `GET`

**DATA** :
```json
{}
```


**Auth required** : NO

## Success Response

**Code** : `200 OK`

**Content examples**

```json
{
    "items":
    [
      {
        "id": 1,
        "name": "Gold",
        "description": "Nearly all of the gold on Earth ...",
        "picture": "Gold.jpg",
        "price": 100.64
      },
      {
        "id": 2,
        "name": "Silver",
        "description": "Silver metal is not toxic to humans...",
        "picture": "Silver.jpg",
        "price": 92.01
      },
      ...
    ]
}
```

# 2. Gets the stock history
Gets the 350 latest history changes for all stocks

**URL** : `/history/stocks`

**Method** : `GET`

**DATA** :
```json
{}
```


**Auth required** : NO

## Success Response

**Code** : `200 OK`

**Content examples**

```json
{
    "data":
    [
      {
        "id": 1652,
        "item_name": "Palladium",
        "when_time": "2019-10-17 14:59:32", // When the change took place
        "old_price": 257.65, // The price before the change
        "price": 185.99 // Current price (will update)
      },
      {
        "id": 1651,
        "item_name": "Osmium",
        "when_time": "2019-10-17 14:59:32",
        "old_price": 244.56,
        "price": 131.09
      },
      ...
    ]
}
```

# 3. Update all stocks
Updates all the stocks

**URL** : `/stocks`

**Method** : `PUT`

**DATA** :
```json
{}
```


**Auth required** : NO

## Success Response

**Code** : `202 ACCEPTED`

**Content examples**

```json
{
    "data": 
    {
      "message": "Stocks sucsessfylly updated"
    }
}
```

# 4. Update all stock prices
Update stocks then sends a socket emit.

**URL** : `/update`

**Method** : `GET`

**DATA** :
```json
{}
```


**Auth required** : NO

## Success Response

**Code** : `202 ACCEPTED`

**Content examples**

```json
{
    "data": 
    {
      "message": "Stocks sucsessfylly updated"
    }
}
```

# 5. Gets a list of all stocks a user owns
Gets a list of all stocks a user owns

**URL** : `/stocks/user`

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

```json
{
    "data": 
    [
      {
        "id": 1,
        "item_name": "Gold",
        "amount": 23,
        "buyer_id": 1,
        "buy_in_price": 43.48,
        "buy_in_date": "2019-10-02 13:40:06",
        "price": 288.64
      },
      {
        "id": 2,
        "item_name": "Silver",
        "amount": 0,
        "buyer_id": 1,
        "buy_in_price": 48.45,
        "buy_in_date": "2019-10-02 13:40:06",
        "price": 255.01
      },
      ...
    ]
}
```
