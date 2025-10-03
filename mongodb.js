
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://vermanaman2106_db_user:JalqGXz5zUTUkBwP@cluster0.gcms4tf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    console.log("✅ Connected to MongoDB Atlas!");
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Pinged your deployment successfully!");
    
    // Connect to your Uniways database (case-sensitive)
    const database = client.db("Uniways");
    
    // List all collections in the database
    const collections = await database.listCollections().toArray();
    console.log("\n📋 Available collections in Uniways database:");
    if (collections.length === 0) {
      console.log("  No collections found in Uniways database");
    } else {
      collections.forEach(collection => {
        console.log(`  - ${collection.name}`);
      });
    }
    
    // Work with FacultyProfile collection
    const facultyCollection = database.collection("FacultyProfile");
    
    // Check if collection has data
    const facultyProfiles = await facultyCollection.find({}).toArray();
    
    if (facultyProfiles.length > 0) {
      console.log(`\n✅ Found data in FacultyProfile collection!`);
      console.log(`👨‍🏫 Found ${facultyProfiles.length} faculty profile(s):`);
      console.log("=" * 60);
      
      facultyProfiles.forEach((faculty, index) => {
        console.log(`\n${index + 1}. Faculty Profile:`);
        console.log(`   ID: ${faculty.id}`);
        console.log(`   Name: ${faculty.name}`);
        console.log(`   Department: ${faculty.department}`);
        console.log(`   Email: ${faculty.email}`);
        console.log(`   Phone: ${faculty.phone}`);
        console.log(`   Designation: ${faculty.designation}`);
        console.log("-" * 40);
      });
    } else {
      console.log("\n📝 FacultyProfile collection is empty. Creating sample data...");
      
      // Create sample faculty data
      const sampleFaculty = {
        id: 1,
        name: "Dr. Aarav Sharma",
        department: "Computer Science",
        email: "aarav.sharma@university.edu",
        phone: "+91-9000000001",
        designation: "Professor"
      };
      
      // Insert sample data
      const result = await facultyCollection.insertOne(sampleFaculty);
      console.log(`✅ Sample faculty profile created with ID: ${result.insertedId}`);
      
      // Fetch and display the created data
      const newFacultyProfiles = await facultyCollection.find({}).toArray();
      console.log(`\n👨‍🏫 Now found ${newFacultyProfiles.length} faculty profile(s):`);
      console.log("=" * 60);
      
      newFacultyProfiles.forEach((faculty, index) => {
        console.log(`\n${index + 1}. Faculty Profile:`);
        console.log(`   ID: ${faculty.id}`);
        console.log(`   Name: ${faculty.name}`);
        console.log(`   Department: ${faculty.department}`);
        console.log(`   Email: ${faculty.email}`);
        console.log(`   Phone: ${faculty.phone}`);
        console.log(`   Designation: ${faculty.designation}`);
        console.log("-" * 40);
      });
    }
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
    console.log("🔌 Disconnected from MongoDB");
  }
}
run().catch(console.dir);

