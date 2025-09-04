const {PrismaClient}=require('../../generated/prisma');
const prisma = new PrismaClient();



const creatEvent = async(req,res)=>{
    const {EventTitle,EventURL,Description,EventDate,Location,EventEndDate}=req.body;
    try{
        if(!EventTitle || !EventURL || !Description || !EventDate || !Location){
            return res.status(400).json({msg : 'All event fields are required.'});
        }

        const newEvent =await prisma.tbl_event.create({
            data:{
                EventTitle,EventURL,Description,EventDate: new Date(EventDate),Location, EventEndDate: EventEndDate ? new Date(EventEndDate) : null,Featured: false
            },
        });

        res.status(201).json({ msg: 'Event created successfully.', event: newEvent });
    }catch(err){
        if (err.code === 'P2002' && err.meta?.target.includes('EventTitle')) {
            return res.status(409).json({ msg: 'An event with that title already exists.' });
        }
        console.error('Create event error:', err.message);
        res.status(500).send('Server Error during event creation');
    }
};

const getallevents = async (req,res)=>{
    try{
        const events= await prisma.tbl_event.findMany({
            orderBy:{createdAt:'desc'},
        });
        res.json(events);
    }catch(err){
        console.error('Get events error:', err.message);
        res.status(500).send('Server Error');
    }
};

const getEventByID = async (req,res)=>{
    const {id} = req.params;
    try{
        const event = await prisma.tbl_event.findUnique({
            where :{ EventID : id},
        });

        if(!event){
              return res.status(404).json({ msg: 'Event not found.' });
        }
        res.json(event);
    }catch(err){
        console.error('Get event by ID error:', err.message);
        res.status(500).send('Server Error');
    }
};

const updateEvent = async (req, res) => {
    const { id } = req.params;
    const { EventTitle, EventURL, Description, EventDate,Location,EventEndDate } = req.body;
    
    try {
        const updatedEvent = await prisma.tbl_event.update({
            where: { EventID: id },
            data: {
                EventTitle,
                EventURL,
                Description,
                EventDate: new Date(EventDate),
                 EventEndDate : EventEndDate ? new Date(EventEndDate) : null,
                Location,
            },
        });

        res.json({ msg: 'Event updated successfully', event: updatedEvent });
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json({ msg: 'Event not found for updating.' });
        }
        if (err.code === 'P2002' && err.meta?.target.includes('EventTitle')) {
            return res.status(409).json({ msg: 'An event with that title already exists.' });
        }
        console.error('Update event error:', err.message);
        res.status(500).send('Server Error during event update');
    }
};

const deleteEventByID = async (req,res)=>{
    const {id}=req.params;
    try{
        await prisma.tbl_event.delete({
            where : { EventID : id },
        });

         res.json({ msg: 'Event deleted successfully.' });
    }catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json({ msg: 'Event not found for deletion.' });
        }
        console.error('Delete event error:', err.message);
        res.status(500).send('Server Error during event deletion');
    }
};


const toggleFeatured = async (req, res) => {
    const { id } = req.params;

    try {
        const existingEvent = await prisma.tbl_event.findUnique({
            where: { EventID: id },
            select: { Featured: true },
        });

        if (!existingEvent) {
            return res.status(404).json({ msg: 'Event not found for toggling.' });
        }
        
        const updatedEvent = await prisma.tbl_event.update({
            where: { EventID: id },
            data: {
                Featured: !existingEvent.Featured,
            },
        });

        res.json({ msg: 'Event featured status toggled successfully.', event: updatedEvent });
    } catch (err) {
        console.error('Toggle featured status error:', err.message);
        res.status(500).send('Server Error during feature toggle');
    }
};

const getTopFeaturedEvents = async (req, res) => {
    try {
        let featuredEvents = await prisma.tbl_event.findMany({
            where: {
                Featured: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 10,
        });

        if (featuredEvents.length === 0) {
            featuredEvents = await prisma.tbl_event.findMany({
                orderBy: {
                    EventDate: 'desc',
                },
                take: 10,
            });
        }

        res.json(featuredEvents);
    } catch (err) {
        console.error('Get top featured events error:', err.message);
        res.status(500).send('Server Error');
    }
};


module.exports = {creatEvent,getallevents,getEventByID,updateEvent,deleteEventByID,toggleFeatured,getTopFeaturedEvents};