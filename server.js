const express = require("express");
const app = express();
const port = 7000;
const fetch = require("node-fetch");

const comapanyDetails = {
  companyName: "meghadarshini-s",
  clientID: "28d3911c-64cf-40d9-83fc-e0b1de73c745",
  clientSecret: "JTVsrIgXXlvECpbD",
  ownerName: "megha",
  ownerEmail: "meghadarshini.02@gmail.com",
  rollNo: "R20EJ114",
};

const allTrains = async (req, res) => {
  try {
    const authToken = await getAuthtoken(); // Await the getAuthtoken function
    const response = await fetch("http://104.211.219.98/train/trains", {
      headers: {
        Authorization: `Bearer ${authToken}`, // Use the retrieved authToken
      },
    });

    if (!response.ok) {
      throw new Error("Request failed");
    }

    const data = await response.json();
    const currentTime = new Date();
    const next12Hours = new Date();
    next12Hours.setHours(currentTime.getHours() + 12);

    const filteredTrains = data.map(({ departTime, ...train }) => {
        const departureTime = new Date();
        departureTime.setHours(departTime.Hours);
        departureTime.setMinutes(departTime.Minutes);
        departureTime.setSeconds(departTime.Seconds);
        
        return {
          ...train,
          departureTime
        };
      }).filter(({ departureTime }) => {
        return departureTime >= currentTime && departureTime <= next12Hours;
      });
      

    res.json(filteredTrains);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const authtoken = async () => {
  try {
    const response = await fetch("http://104.211.219.98/train/auth", {
      method: "POST",
      body: JSON.stringify(comapanyDetails),
    });

    if (!response.ok) {
      throw new Error("Request failed");
    }

    const data = await response.json();
    console.log("data", data);
    return data.access_token;
  } catch (error) {
    console.log("error", error);
  }
};

app.post("/allTrains", allTrains);
app.post("/authtoken", authtoken);

app.listen(port, () => {
  console.log(`server on port ${port}`);
});