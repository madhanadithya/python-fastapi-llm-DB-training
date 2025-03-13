// Define the file path
var filePath = "C:/Users/madhan.adithya/OneDrive - ascendion/Desktop/certificates/Mongo DB/codes/json data files/persons.json";

// Load the JSON file as JavaScript code
load(filePath);

// Insert the data into MongoDB
db.persons.insertMany(persons);

print("✅ Successfully inserted " + persons.length + " records into 'persons' collection.");
