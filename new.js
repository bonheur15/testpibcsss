function AppendData(a) {
    const db = getDatabase();
    push(ref(db, 'sensor/humidity',{
  "value":a,
  "date":"test"
    }), );
  }
  app.get("/sensor/*",(req,res)=>{
    var valuetostore=[];
    valuetostore = req.url;
    valuetostore =  valuetostore.split("/")[2];
    console.log(valuetostore);
    // AppendData(valuetostore);
  
  });
  getDatabase = require ("firebase/database");