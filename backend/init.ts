import fetch from "node-fetch";

const getParticipants = async (selectedId: string = "") => {
  let response = await fetch(`http://localhost:5000/api/participants`);
  return response.json();
};

const addParticipant = async (participant: {}) => {
  let response = await fetch(`http://localhost:5000/api/participants`, {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(participant)
  });
  console.log(response);
};

const deleteParticipant = async (id: string) => {
  let response = await fetch(`http://localhost:5000/api/participants`, {
    method: "delete",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      _id: id
    })
  });
  console.log(response);
};

(async () => {
  let participants = await getParticipants();

  participants.forEach(async (participant: any) => {
    await deleteParticipant(participant._id);
  });

  await addParticipant({
    firstName: "Tristan",
    lastName: "Dickson",
    age: "32"
  });
  await addParticipant({
    firstName: "Oli",
    lastName: "Gill",
    age: "30"
  });
  await addParticipant({
    firstName: "Harrison",
    lastName: "Evans",
    age: "28"
  });
})();
