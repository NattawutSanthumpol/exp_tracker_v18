const model = require('../model/model')

//POST: http://localhost:4000/api/categories
async function create_Categories(req, res) {
     const Create = new model.Categories({
          type: "Investment",
          color: '#fcbe44'
     })

     await Create.save(function (err) {
          if (!err) return res.json(Create)
          return res.status(400).json({ message: `Error while creating categories ${err}` })
     })
}

//GET: http://localhost:4000/api/categories
async function get_Categories(req, res) {
     let data = await model.Categories.find({})

     let filter = await data.map(value => Object.assign({}, { type: value.type, color: value.color }))
     return res.json(filter)
}

//POST: http://localhost:4000/api/transaction
async function create_Transaction(req, res) {
     if (!req.body) return res.status(400).json("Post HTTP Data not Provided");
     let { name, type, amount } = req.body;

     const create = await new model.Transaction({
          name,
          type,
          amount,
          date: new Date()
     })

     create.save(function (err) {
          if (!err) return res.json(create);
          return res.status(400).json({ message: `Error while creating transaction ${err}` });
     })

}

//GET: http://localhost:4000/api/transaction
async function get_Transaction(req, res) {
     let data = await model.Transaction.find({})
     return res.json(data)
}

//DELETE: http://localhost:4000/api/transaction
async function delete_Transaction(req, res) {
     if (!req.body) res.status(400).json({ message: "Request body not Found" })
     await model.Transaction.deleteOne(req.body, function (err) {
          if (!err) res.json("Record Deleted...!")
     }).clone().catch(function (err) { res.json("Error while deleteing Reansaction Record") })
}

//get:http://localhost:4000/api/lables
async function get_Labels(req, res) {
     model.Transaction.aggregate([
          {
               $lookup: {
                    from: "categories",
                    localField: 'type',
                    foreignField: "type",
                    as: "categories_info"
               }

          }, {
               $unwind: "$categories_info"
          }
     ]).then(result => {
          let data = result.map(value => Object.assign({}, { _id: value._id, name: value.name, type: value.type, amount: value.amount, color: value.categories_info['color'] }))
          res.json(data)
     }).catch(error =>{
          res.status(400).json("Looup Collection Error")
     })
}


module.exports = {
     create_Categories,
     get_Categories,
     create_Transaction,
     get_Transaction,
     delete_Transaction,
     get_Labels
}
