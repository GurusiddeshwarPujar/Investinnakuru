const {PrismaClient}=require("../../generated/prisma");

const prisma = new PrismaClient();

const createCategory=async (req,res)=>{
    const {CatName,CatURL}=req.body;
    try{
        if(!CatName || !CatURL){
            return res.status(400).json({msg:'Category name and URL are required.'});
        }

        const newCategory= await prisma.tbl_category.create({
            data:{CatName,CatURL},
        });
        res.status(201).json({msg:'Category created successfully',category : newCategory });

    }catch(err){
       if (err.code === 'P2002' && err.meta?.target.includes('CatName')) {
         return res.status(409).json({ msg: 'A category with that name already exists.' });
        }
        console.error('Create category error:', err.message);
        res.status(500).send('Server Error during category creation');
    }   
};

const getallCategory =async (req,res)=>{
    try{
        const categories= await prisma.tbl_category.findMany({
            orderBy:{createdAt:'desc'},
        });
        res.json(categories);
    }catch(err){
        console.error('Get categories error:',err.message);
        res.status(500).send('Server Error');
    }
};


const updateCategory= async (req,res)=>{
    const {id} = req.params;
    const { CatName, CatURL } = req.body;
    try{
        const updatedCategory = await prisma.tbl_category.update({
            where :{CatId :id},
            data:{
                CatName,CatURL,
            },
        });
        res.json({msg:'Category updated sucessfully.',category :updatedCategory});
    }catch(err){
        if (err.code === 'P2025') {
            return res.status(404).json({ msg: 'Category not found for updating.' });
        }
        if (err.code === 'P2002' && err.meta?.target.includes('CatName')) {
            return res.status(409).json({ msg: 'A category with that name already exists.' });
        }
        console.error('Update category error:', err.message);
        res.status(500).send('Server Error during category update');
    }
};


const deleteCategory=async (req,res)=>{
    const {id}=req.params;
    try{
        await prisma.tbl_category.delete({
            where :{CatId:id},
        });
        res.json({msg :'Category deleted successfully'});
    }catch(err){
        if(err.code === 'P2025'){
            return res.status(404).json({ msg: 'Category not found for deletion.' });
        }
        console.error('Delete category error:', err.message);
        res.status(500).send('Server Error during category deletion');
    }
};



module.exports={createCategory,getallCategory,updateCategory,deleteCategory};