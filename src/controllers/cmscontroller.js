
const {PrismaClient} =require('../../generated/prisma');
const prisma = new PrismaClient();

const updateCms = async (req,res)=>{
    const {CmsPageName,CmsText} = req.body;

    if (!CmsPageName || !CmsText) {
        return res.status(400).json({ msg: 'CmsPageName and CmsText are required fields.' });
    }

    try {
                // const updatedCms = await  prisma.tbl_cms.upsert({
                //     where :{ CmsPageName :CmsPageName},
                //     update:{CmsText:CmsText},
                //     create:{
                //         CmsPageName,CmsText,
                //     }
                // });

        const updatedCms=await prisma.tbl_cms.update({
            where: {CmsPageName :CmsPageName},
            data:{CmsText:CmsText},
        });

        res.status(200).json({msg:'Cms content updated successfully',cms:updatedCms});
    }
    catch (err) {
        console.error('Update CMS error:', err.message);
        res.status(500).send('Server Error during CMS update');
    }
};


const getCms= async(req,res)=>{
    try{
        const cmsEntries = await prisma.tbl_cms.findMany();
        res.json(cmsEntries);
    }catch(err){
        console.error('Get Cms error :',err.message);
        res.status(500).send('Server Error');
    }
};

const getCmsByPageName = async (req,res) =>{
        const {pageName}= req.params;

        try{
           const cmsEntry = await prisma.tbl_cms.findUnique({
            where: { CmsPageName: pageName },
        });

            if(!cmsEntry){
                 return res.status(404).json({ msg: 'CMS entry not found for that page name.' });
            }

            res.json(cmsEntry);

        }catch(err){
            console.error('Get CMS by name error:', err.message);
            res.status(500).send('Server Error');
        }
}

module.exports ={updateCms,getCms ,getCmsByPageName};