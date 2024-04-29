const cors = require("cors");

const app = express();

// Enable CORS
app.use(cors());
app.use(express.json());
const users = [];

const corsOptions = {
  origin: "http://localhost:4200", // Allow requests only from this origin
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204
};

app.use(cors(corsOptions));
const port = 8080 || process.env.PORT;

app.get("/", (request, response) => {
  response.status(200).send("Hello In Our Server");
});
app.get("/test", (request, response) => {
  response.status(200).send("Hello In Our Server");
});

app.get("/allusers", (req, res) => {
  if (users.length === 0) {
    res.status(404).send("No Users Found yet");
  } else {
    res.status(200).send(users);
  }
});

function checkUserAlreadyExist(email) {
  return users.some((user) => user.email === email);
}

app.post("/adduser", (req, res) => {
  const { name, password, email } = req.body;
  const data = {
    name: name,
    password: password,
    email: email,
  };

  if (data.name.length === 0 || data.name.length < 3) {
    res.status(400).send("Invalid name");
    return;
  }

  if (data.password.length === 0) {
    res.status(400).send("Invalid password");
    return;
  }

  if (data.email.length === 0) {
    res.status(400).send("Invalid email");
    return;
  }

  if (checkUserAlreadyExist(email)) {
    res.status(400).send("User already exists");
    return;
  }

  users.push(data);
  res.status(200).send("User added successfully");
});

app.delete("/delete/:password", (req, res) => {
  const { password } = req.params;
  const finduserIndex = users.findIndex((user) => user.password === password);
  if (finduserIndex === -1) {
    res.status(404).send("User not found");
    return;
  }
  users.splice(finduserIndex, 1);
  res.status(200).send("User deleted");
});

function getUserByPassword(password) {
  return users.find((user) => user.password === password);
}

app.get("/user/:password", (req, res) => {
  const { password } = req.params;
  const user = getUserByPassword(password);
  if (!user) {
    res.status(404).send("User not found");
    return;
  }
  res.status(200).send(user);
});

app.post("/login", (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    res.status(400).send("Email and password are required");
    return;
  }
  const user = users.find(
    (user) =>
      user.email === email && user.password === password && user.name === name
  );
  if (!user) {
    res.status(401).send("Invalid email or password");
    return;
  }
  res.status(200).send("Login successful");
});

app.listen(port, () => {
  console.log("Application running on port " + port);
});
