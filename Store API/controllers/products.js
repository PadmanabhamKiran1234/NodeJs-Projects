const Product =require('../models/product')

const getAllProductsStatic = async (req,res)=>{
    
    const products = await Product.find({price:{$gt:30}}).sort('name').select('name price')
    res.status(200).json({products,nbHits:products.length})
}



const getAllProducts = async (req,res)=>{
    const {featured,company,name,sort,fields,numericFilters} = req.query
    const queryObject = {}

    if(featured){
        queryObject.featured = featured === 'true'? true : false
    }

    if(company){
        queryObject.company = company 
    }

    //it will filter for every word , like if we give a letter it will find all prodcuts which contain that letter
    if(name){
        queryObject.name = { $regex:name , $options:'i' }
    }

    if(numericFilters){
        const operatorMap = {
            '>' : '$gt',
            '>=' : '$gte',
            '=' : '$eq',
            '<' : '$lt',
            '<=' : '$lte',
        }
        const regEx =/\b(>|>=|=|<=|<)\b/g 
        let filters = numericFilters.replace(
            regEx,
            (match)=>`-${operatorMap[match]}-`
            )
        const options = ['price','rating']
        filters = filters.split(',').forEach((item) => {
            const [field,operator,value] = item.split('-')
            if(options.includes(field)){
                queryObject[field] = {[operator]:Number(value)}
            }
        });
    }
    console.log(queryObject)

    let result =  Product.find(queryObject)

    //sort
    if(sort){
        const sortList = sort.split(',').join(' ')
        result =result.sort(sortList)
    }
    else{
        result = result.sort('createdAt')
    }

    //selecting the fields we want to display
    if(fields){
        const fieldsList = fields.split(',').join(' ')
        result =result.select(fieldsList) 
    }

    const page = Number(req.query.page) || 1 
    const limit = Number(req.query.limit) || 10
    const skip = (page-1) * limit
    //let limit 6 it will show 1st 6 items on page 1
    //if u want next 6 that means Page =2 
    //skip = (2-1) * 6
    //It will skip 1st 6 items and show u next 6 items

    result = result.skip(skip).limit(limit)
    const products = await result
    res.status(200).json({ products, nbHits:products.length})
}


module.exports = {
    getAllProducts,
    getAllProductsStatic,
}