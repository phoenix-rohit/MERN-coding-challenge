MONGOOSE SORT

pass parameters inside sort
sort(req.query.sort)

We can sort by multiple paramters we just have to remove "," and replace it with " " the mongoose will automatically figure it out and will sort them by given paramters

```
$match: {
          $expr: {
            $eq: [{ $month: "$dateOfSale" }, month],
          },
        },

```

what is expr and how does it helps
