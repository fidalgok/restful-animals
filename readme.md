# Restful Animals

This is a simple app that will add animals to a mongo database. It will include all 7 restful routes. I will be using some basic styling with semantic ui. I will also practice using some markdown syntax to style my markdown documents better. I will use a simple checklist at the bottom to track progress of my basic app.

## Restful routes

Name | Path | HTTP Verb | Purpose | Mongoose Method
---- | ---- | --------- | ------- | ---------------
Index | /animals | GET | show all animals | animal.find({}, callback)
New | /animals/new | GET | shows a new animal form | N/A
Create | /animals | POST | adds new animal to db then redirect somewhere | animal.create(animal object, callback)
Show | /animals/:id | GET | show details about one animal | animal.findById(id, callback)
Edit | /animals/:id/edit | GET | show animal edit form for specific animal | animal.findById(id, callback)
Update | /animals/:id | PUT | update animal then redirect somewhere | animal.findByIdAndUpdate
Destroy | /animals/:id | DELETE | Delete animal then redirect somewhere | animal.findByIdAndRemove(id, callback)

## Tasks to be done

- [x] configure app.js for basic functionality
- [x] setup index route, header and footer partials, and animals.ejs template
- [x] configure the mongoose schema and model and get the mongo db animals collection setup
- [x] setup the new route and template and the create route then create a few animals
- [] setup the show route and template
- [] setup the edit route and template and the update route
- [] setup the destroy route