## Content
1. Example of errors  

Back to [README](../../../README.md)



# 1. Example of errors
Example of how an error would look like

**URL** : `*`

**Method** : `ANY`

**Auth required** : NO

## Response

**Code** : `500, 404, 401, 400`

**Content examples**

```json
{
  "errors":
  {
    "source": "{ The source route }",
    "title": "{ Title that describes the error }",
    "detail": "{ More information about the error }",
    "status": "{ The given status code }"
  }
}
```
