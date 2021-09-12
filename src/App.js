import React, { useState, useEffect } from "react";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Signin from "./components/auth/Signin";
import Admins from "./components/pages/Admins";
import Layout from "./components/layout/Layout";
import AdminLayout from "./components/layout/AdminLayout";
import Users from "./components/pages/Users";
import Locations from "./components/pages/Locations";
import Tasks from "./components/pages/Tasks";
import { db } from "./components/firebase/firebase";
import Alerts from "./components/pages/Alerts";
import PushMessage from "./components/pages/PushMessage";
import AddLocation from "./components/Modals/Location/AddLocation";
import Settings from "./components/pages/Settings";

function App() {
  const [users, setUsers] = useState([]);
  const [locations, setLocations] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [apiKey, setapiKey] = useState([]);
  const [currentUser, setcurrentUser] = useState();

  useEffect(() => {
    async function fetchData() {
      db.collection("Users")
        .orderBy("created_on", "desc")
        .onSnapshot((snapshot) => {
          setUsers(
            snapshot.docs.map((doc) => {
              return { ...doc.data(), id: doc.id };
            })
          );
        });
      db.collection("Location")
        .orderBy("created_on", "desc")
        .onSnapshot((snapshot) => {
          setLocations(
            snapshot.docs.map((doc) => {
              return { ...doc.data(), id: doc.id };
            })
          );
        });
    }
    fetchData();
  }, []);
  useEffect(() => {
    async function fetchData() {
      db.collection("Tasks")
        .orderBy("created_on", "desc")
        .onSnapshot((snapshot) => {
          setTasks(
            snapshot.docs.map((doc) => {
              return { ...doc.data(), id: doc.id };
            })
          );
        });
      db.collection("Alerts")
        .orderBy("created_on", "desc")
        .onSnapshot((snapshot) => {
          setAlerts(
            snapshot.docs.map((doc) => {
              return { ...doc.data(), id: doc.id };
            })
          );
        });
      db.collection("Api").onSnapshot((snapshot) => {
        setapiKey(
          snapshot.docs.map((doc) => {
            return { ...doc.data(), id: doc.id };
          })
        );
      });
    }
    fetchData();
  }, []);
  console.log(apiKey[0]);
  return (
    <Router>
      <Switch>
        <Route
          exact
          path="/admin/manageadmins"
          render={() => <AdminLayout body={<Admins />} />}
        />
        <Route
          exact
          path="/admin/users"
          render={() => <AdminLayout body={<Users users={users} />} />}
        />
        <Route
          exact
          path="/admin/locations"
          render={() => (
            <AdminLayout
              body={<Locations locations={locations} apiKey={apiKey} />}
            />
          )}
        />
        <Route
          exact
          path="/admin/log"
          render={() => (
            <AdminLayout
              body={<Tasks tasks={tasks} users={users} locations={locations} />}
            />
          )}
        />
        <Route
          exact
          path="/admin/alerts"
          render={() => <AdminLayout body={<Alerts alerts={alerts} />} />}
        />
        <Route
          exact
          path="/admin/pushmessage"
          render={() => <AdminLayout body={<PushMessage users={users} />} />}
        />
        <Route
          exact
          path="/admin/settings"
          render={() => (
            <AdminLayout
              body={<Settings apiKey={apiKey} currentUser={currentUser} />}
            />
          )}
        />
        <Route
          exact
          path="/users"
          render={() => <Layout body={<Users users={users} />} />}
        />
        <Route
          exact
          path="/locations"
          render={() => (
            <Layout
              body={<Locations locations={locations} apiKey={apiKey} />}
            />
          )}
        />
        <Route
          exact
          path="/log"
          render={() => (
            <Layout
              body={<Tasks tasks={tasks} users={users} locations={locations} />}
            />
          )}
        />
        <Route
          exact
          path="/alerts"
          render={() => <Layout body={<Alerts alerts={alerts} />} />}
        />
        <Route
          exact
          path="/pushmessage"
          render={() => <Layout body={<PushMessage users={users} />} />}
        />
        <Route
          exact
          path="/settings"
          render={() => (
            <Layout
              body={<Settings apiKey={apiKey} currentUser={currentUser} />}
            />
          )}
        />
        <Route
          exact
          path="/"
          render={() => <Signin setcurrentUser={setcurrentUser} />}
        />
      </Switch>
    </Router>
  );
}

export default App;
