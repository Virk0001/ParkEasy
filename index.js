let currId = 0;

const users = [];
const employees = [];
const vehicles = [];
const Lots = [];        
const spaces = [];
const tickets = [];
const payments = [];
const rates = [];
const fines = [];
const reservations = [];
const Daily_Revenue = [];
const yearly_Revenue = [];
const Daily_Logs = [];

import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import flash from "connect-flash"; 

const app = express();
const port = 3000;
const saltRounds = 10; // for hashing

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "Vehicles",
  password: "9105",
  port: 5432,
});

// [] // db connection


db.connect();
  // users table import
  db.query("SELECT * FROM users", (err, res) => {
    if (err) {
      console.error("Error executing query", err.stack);
    } else {
      users.push(...res.rows);
    }
  });
// employees table import
  db.query("SELECT * FROM employees", (err, res) => {
    if (err) {
      console.error("Error executing query", err.stack);
    } else {
      employees.push(...res.rows);
    }
  });
  // vehicles table import
  db.query("SELECT * FROM vehicles", (err, res) => {
    if (err) {
      console.error("Error executing query", err.stack);
    } else {
      vehicles.push(...res.rows);
    }
  });
  // Lots table import
  db.query('SELECT * FROM "Lots" ', (err, res) => {
    if (err) {
      console.error("Error executing query", err.stack);
    } else {
      Lots.push(...res.rows);
    }
  });
  // spaces table import
  db.query("SELECT * FROM spaces", (err, res) => {
    if (err) {
      console.error("Error executing query", err.stack);
    } else {
      spaces.push(...res.rows);
    }
  });
  // tickets table import
  db.query("SELECT * FROM tickets", (err, res) => {
    if (err) {
      console.error("Error executing query", err.stack);
    } else {
      tickets.push(...res.rows);
    }
  });
  // payments table import
  db.query("SELECT * FROM payments", (err, res) => {
    if (err) {
      console.error("Error executing query", err.stack);
    } else {
      payments.push(...res.rows);
    }
  });
  // rates table import
  db.query("SELECT * FROM rates", (err, res) => {
    if (err) {
      console.error("Error executing query", err.stack);
    } else {
      rates.push(...res.rows);
    }
  });
  // fines table import
  db.query("SELECT * FROM fines", (err, res) => {
    if (err) {
      console.error("Error executing query", err.stack);
    } else {
      fines.push(...res.rows);
    }
  });
  // reservations table import
  db.query("SELECT * FROM reservations", (err, res) => {
    if (err) {
      console.error("Error executing query", err.stack);
    } else {
      reservations.push(...res.rows);
    }
  });
  // Daily_Revenue table import
  db.query('SELECT * FROM "Daily_Revenue"', (err, res) => {
    if (err) {
      console.error("Error executing query", err.stack);
    } else {
      Daily_Revenue.push(...res.rows);
    }
  });
  // yearly_Revenue table import
  db.query('SELECT * FROM "yearly_Revenue"', (err, res) => {
    if (err) {
      console.error("Error executing query", err.stack);
    } else {
      yearly_Revenue.push(...res.rows);
    }
  });
  // Daily_logs table import
  db.query('SELECT * FROM "Daily_Logs"', (err, res) => {
    if (err) {
      console.error("Error executing query", err.stack);
    } else {
      Daily_Logs.push(...res.rows);
    }
  });
 // [/]

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
  secret: "your_secret_key", 
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } 
}));
app.use(flash()); 
app.use(passport.initialize());
app.use(passport.session());


app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) return done(null, false, { message: "Incorrect email." });
    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return done(null, false, { message: "Incorrect password." });
    user.role = 'user'; 
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((entity, done) => {
  let id;
  const type = entity.role;

  if (type === 'employee') {
    id = entity.emp_id; 
    if (!id) {
      console.error("serializeUser: emp_id not found on employee object. Check employee table PK.");
      return done(new Error('Employee ID (emp_id) not found for serialization'));
    }
  } else if (type === 'user') {
    id = entity.user_id;
  } else {
    console.error(`serializeUser: Unknown entity type: ${type}`);
    return done(new Error('Unknown entity type for serialization'));
  }

  if (!id) {
    console.error(`serializeUser: No ID found for type ${type}`);
    return done(new Error(`No ID found for ${type} serialization`));
  }
  done(null, { id: id, type: type });
});

passport.deserializeUser(async (sessionData, done) => {
  try {
    if (!sessionData || typeof sessionData.id === 'undefined' || !sessionData.type) {
      return done(new Error('Invalid session data for deserialization'));
    }
    const id = sessionData.id;
    const type = sessionData.type;
    let entity = null;
    let queryResult;

    if (type === 'employee') {
      queryResult = await db.query("SELECT * FROM employees WHERE emp_id = $1", [id]); 
      if (queryResult.rows.length > 0) {
        entity = queryResult.rows[0];
        entity.role = 'employee'; 
      }
    } else if (type === 'user') {
      queryResult = await db.query("SELECT * FROM users WHERE user_id = $1", [id]);
      if (queryResult.rows.length > 0) {
        entity = queryResult.rows[0];
        entity.role = 'user';
      }
    } else {
      return done(new Error('Unknown entity type for deserialization'));
    }

    if (!entity) {
      return done(null, false, { message: 'Entity not found during deserialization.' });
    }
    done(null, entity);
  } catch (err) {
    done(err);
  }
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}

function ensureEmployee(req, res, next) {
  if (req.isAuthenticated() && req.user.role === 'employee') {
    return next();
  }
  req.flash("error", "You do not have permission to view this page."); 
  res.redirect("/login");
}


app.get("/", (req, res) => {
    res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs"); 
});

app.post("/login", async (req, res, next) => {
  const { role, email, password } = req.body;
  if (role === "user") {
    
    try {
      const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
      if (result.rows.length === 0) {
        req.flash("error", "Invalid email or password."); 
        return res.redirect("/login");
      }
      const user = result.rows[0];
      user.role = 'user'; 
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        req.flash("error", "Invalid email or password.");
        return res.redirect("/login");
      }
      req.login(user, (err) => {
        if (err) return next(err);
        req.flash("success_msg", "You are now logged in.");
        return res.redirect("/dashboard");
      });
    } catch (err) {
      return next(err);
    }
  } else if (role === "employee") {
  
    try {
      const result = await db.query("SELECT * FROM employees WHERE email = $1", [email]);
      if (result.rows.length === 0) {
        req.flash("error", "Invalid email or password."); 
        return res.redirect("/login");
      }
      const employee = result.rows[0];
      employee.role = "employee"; 
      const match = await bcrypt.compare(password, employee.password);
      if (!match) {
        req.flash("error", "Invalid email or password."); 
        return res.redirect("/login");
      }
      req.login(employee, (err) => {
        if (err) return next(err);
        req.flash("success_msg", "You are now logged in.");
        return res.redirect("/dashboard");
      });
    } catch (err) {
      return next(err);
    }
  } else {
    req.flash("error", "Please select a role."); 
    return res.redirect("/login");
  }
});

app.get("/register", (req, res) => {
    res.render("signup.ejs"); 
});

//hashing complete during reg
app.post("/registerDone", async (req, res) => {
  const { name, email, phone, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    req.flash("error", "Passwords do not match"); 
    return res.redirect("/register");
  }

  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);

    if (checkResult.rows.length > 0) {
      req.flash("error", "Email already exists. Try logging in."); 
      return res.redirect("/register");
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const insertQuery = `
      INSERT INTO users (name, email, phone, password)
      VALUES ($1, $2, $3, $4)
      RETURNING user_id
    `;
    const values = [name, email, phone, hashedPassword];

    const result = await db.query(insertQuery, values);

    console.log("User registered with ID:", result.rows[0].user_id);
    req.flash("success_msg", "Registration successful. Please log in.");
    res.redirect("/login");

  } catch (err) {
    console.error("Registration error:", err.stack);
    req.flash("error", "Something went wrong. Please try again."); 
    res.redirect("/register");
  }
});

app.get("/about", (req, res) => {
    res.render("about.ejs");
});

// after login or register
// hashing successful
app.get("/dashboard", ensureAuthenticated, (req, res) => {
  if (req.user.role === "employee") {
    res.render("emp_dash.ejs", { username: req.user.name }); 
  } else {
    res.render("dashboard_user.ejs", { username: req.user.name }); 
  }
});

// USER
app.get("/manage_vec", ensureAuthenticated, (req, res) => {
  db.query("SELECT * FROM vehicles WHERE user_id = $1", [req.user.user_id], (err, result) => {
    if (err) return res.status(500).send("Error fetching vehicles");
    res.render("manage_vec.ejs", { data: result.rows, username: req.user.name });
  });
});

app.post("/add-vehicle", ensureAuthenticated, async (req, res) => {
  const { license_plate, model, vehicle_type, color } = req.body;
  const userId = req.user.user_id;

  if (!license_plate || !model || !vehicle_type || !color) {
    req.flash("error", "All vehicle fields are required.");
    return res.redirect("/manage_vec");
  }

  try {
    const insertQuery = `
      INSERT INTO vehicles (user_id, license_plate, vehicle_type, model, color)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING vehicle_id
    `;
    const values = [userId, license_plate, vehicle_type, model, color];

    const result = await db.query(insertQuery, values);
    console.log("Vehicle added with ID:", result.rows[0].vehicle_id);
    req.flash("success_msg", "Vehicle added successfully!");
    res.redirect("/manage_vec");

  } catch (err) {
    console.error("Error adding vehicle:", err.stack);
    req.flash("error", "Unable to add vehicle. Please try again.");
    res.redirect("/manage_vec");
  }
});

app.post("/delete-vehicle", ensureAuthenticated, async (req, res) => {
  const { vehicle_id } = req.body;
  const userId = req.user.user_id;

  if (!vehicle_id) {
    req.flash("error", "Vehicle ID is missing.");
    return res.redirect("/manage_vec");
  }

  try {
    const vehicleCheck = await db.query("SELECT user_id FROM vehicles WHERE vehicle_id = $1", [vehicle_id]);
    if (vehicleCheck.rows.length === 0) {
      req.flash("error", "Vehicle not found.");
      return res.redirect("/manage_vec");
    }
    if (vehicleCheck.rows[0].user_id !== userId) {
      req.flash("error", "You are not authorized to delete this vehicle.");
      return res.redirect("/manage_vec");
    }

    
    const ticketsCheck = await db.query("SELECT ticket_id FROM tickets WHERE vehicle_id = $1 LIMIT 1", [vehicle_id]);
    if (ticketsCheck.rows.length > 0) {
      req.flash("error", "Cannot delete vehicle. It has associated tickets. Please clear all dues before deleting.");
      return res.redirect("/manage_vec");
    }

    
    const reservationsCheck = await db.query("SELECT reservation_id FROM reservations WHERE vehicle_id = $1 LIMIT 1", [vehicle_id]);
    if (reservationsCheck.rows.length > 0) {
      req.flash("error", "Cannot delete vehicle. It has active reservations. Please cancel them before deleting.");
      return res.redirect("/manage_vec");
    }

    const deleteQuery = "DELETE FROM vehicles WHERE vehicle_id = $1 AND user_id = $2";
    const result = await db.query(deleteQuery, [vehicle_id, userId]);

    if (result.rowCount > 0) {
      req.flash("success_msg", "Vehicle deleted successfully!");
    } else {
      req.flash("error", "Could not delete vehicle. It might have already been deleted or does not belong to you.");
    }
    res.redirect("/manage_vec");

  } catch (err) {
    if (err.code === '23503') { 
      if (err.constraint === 'tickets_vehicle_id_fkey') {
        req.flash("error", "Cannot delete vehicle. It has associated tickets or fines. Please clear all dues before deleting.");
      } else if (err.constraint === 'reservations_vehicle_id_fkey') {
        req.flash("error", "Cannot delete vehicle. It has associated reservations. Please cancel them before deleting.");
      } else {
        req.flash("error", "Cannot delete vehicle due to existing references in other records.");
      }
    } else {
      console.error("Error deleting vehicle:", err.stack);
      req.flash("error", "Unable to delete vehicle. Please try again.");
    }
    res.redirect("/manage_vec");
  }
});

app.get("/reservations_user", ensureAuthenticated, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const lotsQuery = db.query('SELECT l.lot_id, l.name, (SELECT COUNT(*) FROM "spaces" s WHERE s.lot_id = l.lot_id AND s.is_occupied = FALSE) as available_spaces_count FROM "Lots" l WHERE (SELECT COUNT(*) FROM "spaces" s WHERE s.lot_id = l.lot_id AND s.is_occupied = FALSE) > 0');
    const vehiclesQuery = db.query("SELECT vehicle_id, license_plate || ' (' || vehicle_type || ')' as registration FROM vehicles WHERE user_id = $1", [userId]); 
    const reservationsQuery = db.query(
      `SELECT r.reservation_id, r.space_id, pl.name as lot_name, v.license_plate || ' (' || v.vehicle_type || ')' as registration, r.start_time, r.end_time
       FROM reservations r
       JOIN spaces s ON r.space_id = s.space_id
       JOIN "Lots" pl ON s.lot_id = pl.lot_id
       JOIN vehicles v ON r.vehicle_id = v.vehicle_id
       WHERE v.user_id = $1
       ORDER BY r.start_time DESC`,
      [userId]
    );

    const [lotsResult, vehiclesResult, reservationsResult] = await Promise.all([lotsQuery, vehiclesQuery, reservationsQuery]);

    res.render("reservations_user.ejs", {
      username: req.user.name, 
      lots: lotsResult.rows,
      vehicles: vehiclesResult.rows,
      reservations: reservationsResult.rows,
    });
  } catch (err) {
    console.error("Error fetching data for reservations page:", err);
    res.status(500).send("Error loading page");
  }
});

app.post("/reservations_user/reserve", ensureAuthenticated, async (req, res) => {
  const { lot_id, vehicle_id, start_time, end_time } = req.body;

  try {
    const spaceRes = await db.query(`
      SELECT space_id
      FROM "spaces"
      WHERE lot_id = $1 AND is_occupied = false
      LIMIT 1
    `, [lot_id]);

    if (!spaceRes.rows.length) {
      return res.status(400).send("No spaces available in that lot");
    }
    const space_id = spaceRes.rows[0].space_id;

  
    await db.query(`
      INSERT INTO reservations 
        (user_id, space_id, start_time, end_time, status, reservation_fee, vehicle_id)
      VALUES 
        ($1, $2, $3, $4, 'Confirmed', 0, $5)
    `, [req.user.user_id, space_id, start_time, end_time, vehicle_id]);

    
    await db.query(`
      UPDATE "spaces"
      SET is_occupied = true
      WHERE space_id = $1
    `, [space_id]);

  
    res.redirect("/reservations_user");
  } catch (err) {
    console.error("Error creating reservation:", err);
    res.status(500).send("Server error");
  }
});

// delete 
app.post("/reservations_user/delete", ensureAuthenticated, async (req, res) => {
  const { reservation_id, space_id } = req.body;

  try {
    
    await db.query(
      `DELETE FROM reservations WHERE reservation_id = $1`,
      [reservation_id]
    );

    // 2) Mark the space as unoccupied
    await db.query(
      `UPDATE "spaces" SET is_occupied = false WHERE space_id = $1`,
      [space_id]
    );

    
    res.redirect("/reservations_user");
  } catch (err) {
    console.error("Error deleting reservation:", err);
    res.status(500).send("Server error");
  }
});

app.get("/tickets_fines", ensureAuthenticated, async (req, res) => {
  try {
    const { type, sort } = req.query; 

    
    let unpaidQuery = `
      SELECT 'Parking Fee' AS type, p.amount, p.payment_id AS charge_id 
      FROM payments p
      JOIN tickets t ON p.ticket_id = t.ticket_id
      WHERE t.user_id = $1 AND p.status != 'Completed'
      UNION ALL
      SELECT 'Fine' AS type, f.amount, f.fine_id AS charge_id
      FROM fines f
      JOIN tickets t ON f.ticket_id = t.ticket_id
      WHERE t.user_id = $1 AND f.status != 'Paid'
    `;
    const unpaidResult = await db.query(unpaidQuery, [req.user.user_id]);

    const paidQuery = `
      SELECT 'Parking Fee' AS type, p.amount, p.transaction_time AS payment_date
      FROM payments p
      JOIN tickets t ON p.ticket_id = t.ticket_id
      WHERE t.user_id = $1 AND p.status = 'Completed'
      UNION ALL
      SELECT 'Fine' AS type, f.amount, t.entry_time AS payment_date 
      FROM fines f
      JOIN tickets t ON f.ticket_id = t.ticket_id
      WHERE t.user_id = $1 AND f.status = 'Paid'
      ORDER BY payment_date DESC
    `;
    const paidResult = await db.query(paidQuery, [req.user.user_id]);

    let displayedCharges = unpaidResult.rows;

    
    if (type && type !== "") { 
      displayedCharges = displayedCharges.filter(charge => charge.type === type);
    }

    
    if (sort === 'amount_asc') {
      displayedCharges.sort((a, b) => parseFloat(a.amount) - parseFloat(b.amount));
    } else if (sort === 'amount_desc') {
      displayedCharges.sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));
    }

    res.render("tickets_fines.ejs", {
      username: req.user.name,
      charges: displayedCharges, 
      paid_charges: paidResult.rows,
      type: type, 
      sort: sort 
    });

  } catch (err) {
    console.error("Error fetching tickets/fines:", err);
    req.flash("error", "Could not load your tickets and fines. Please try again later.");
    res.redirect("/dashboard"); 
  }
});

app.get("/logout", (req, res) => {
  req.logout(() => {
    req.session.destroy();
    res.clearCookie("connect.sid");
    res.render("home.ejs");
  });
});

//EMPLOYEE
app.get("/lots", ensureAuthenticated, ensureEmployee, (req, res) => {
  db.query('SELECT * FROM "Lots" ORDER BY lot_id ASC', (err, result) => { 
    if (err) {
      console.error("Error fetching parking lots:", err);
      return res.status(500).send("Error fetching parking lots");
    }
    res.render("lots.ejs", { 
      lots: result.rows,
      username: req.user.name 
    });
  });
});

app.get("/res_emp", ensureAuthenticated, ensureEmployee, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        r.reservation_id,
        u.name AS user_username,
        u.email AS user_email,
        v.license_plate AS vehicle_license_plate,
        v.model AS vehicle_model,
        l.name AS lot_name,
        s.space_id AS "space_identifier",
        r.start_time,
        r.end_time,
        r.status
      FROM reservations r
      JOIN users u ON r.user_id = u.user_id
      JOIN vehicles v ON r.vehicle_id = v.vehicle_id
      JOIN spaces s ON r.space_id = s.space_id
      JOIN "Lots" l ON s.lot_id = l.lot_id
      ORDER BY r.start_time DESC
    `);

    res.render("res_Emp.ejs", { 
      reservations: result.rows,
      username: req.user.name
    });
  } catch (err) {
    console.error("Error fetching reservations:", err);
    res.status(500).send("Server error");
  }
});

app.get("/manage_user", ensureAuthenticated, async (req, res) => {
  try {
    
    const result = await db.query(`SELECT user_id, name, email FROM "users"`); 
    res.render("manage_user.ejs", { users: result.rows, username: req.user.name });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/manage_user/manage", ensureAuthenticated, async (req, res) => {

});

app.post("/delete_user", ensureAuthenticated, async (req, res) => {
  const userId = req.body.user_id;
  console.log("Deleting user with ID:", userId);
  try {
    await db.query(`DELETE FROM users WHERE user_id = $1`, [userId]);
    console.log("User deleted successfully");
    res.redirect("/manage_user");
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).send("Error deleting user.");
  }
});

app.post("/manage_users/manage", async (req, res) => {
  const userId = req.body.user_id;

  try {
    const userResult = await db.query(`SELECT * FROM users WHERE user_id = $1`, [userId]);
    if (userResult.rows.length === 0) return res.status(404).send("User not found");

    const vehiclesResult = await db.query(`
      SELECT 
        v.model,
        s.lot_id AS lot, 
        s.space_id,
        s.vehicle_id IS NOT NULL AS is_parked
      FROM vehicles v
      LEFT JOIN spaces s ON v.vehicle_id = s.vehicle_id
      WHERE v.user_id = $1
    `, [userId]);

    res.render("manage_user_manage.ejs", {
      user: userResult.rows[0],
      vehicles: vehiclesResult.rows
    });

  } catch (err) {
    console.error("Error loading user vehicles:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/logs", ensureAuthenticated, ensureEmployee, async (req, res) => {
  try {
    res.render("logs.ejs", { username: req.user.name }); 
  } catch (err) {
    console.error("Error loading logs page:", err);
    res.status(500).send("Error loading page");
  }
});

app.get("/api/logs", async (req, res) => {
  const date = req.query.date || new Date().toISOString().slice(0,10);
  const userSearch = req.query.user || '';
  const vehicleSearch = req.query.vehicle || '';

  try {
    const { rows } = await db.query(`
      WITH created AS (
        SELECT 
          r.start_time   AS timestamp,
          'Created'      AS action,
          l.name         AS lot_name,
          u.name         AS user_name,
          v.license_plate || ' (' || v.model || ')' AS vehicle
        FROM reservations r
        JOIN spaces s   ON r.space_id   = s.space_id
        JOIN "Lots" l   ON s.lot_id     = l.lot_id
        JOIN users u    ON r.user_id    = u.user_id
        JOIN vehicles v ON r.vehicle_id = v.vehicle_id
        WHERE r.start_time::date = $1
          AND u.name ILIKE '%' || $2 || '%'
          AND (v.license_plate ILIKE '%' || $3 || '%' OR v.model ILIKE '%' || $3 || '%')
      ),
      finished AS (
        SELECT 
          r.end_time     AS timestamp,
          'Finished'     AS action,
          l.name         AS lot_name,
          u.name         AS user_name,
          v.license_plate || ' (' || v.model || ')' AS vehicle
        FROM reservations r
        JOIN spaces s   ON r.space_id   = s.space_id
        JOIN "Lots" l   ON s.lot_id     = l.lot_id
        JOIN users u    ON r.user_id    = u.user_id
        JOIN vehicles v ON r.vehicle_id = v.vehicle_id
        WHERE r.end_time::date = $1
          AND u.name ILIKE '%' || $2 || '%'
          AND (v.license_plate ILIKE '%' || $3 || '%' OR v.model ILIKE '%' || $3 || '%')
      )
      SELECT * FROM created
      UNION ALL
      SELECT * FROM finished
      ORDER BY timestamp;
    `, [date, userSearch, vehicleSearch]);

    res.json(rows);
  } catch (err) {
    console.error("Error fetching logs:", err);
    res.status(500).send("Server error");
  }
});

app.get("/issue_fine", ensureAuthenticated, ensureEmployee, async (req, res) => {
  try {
    const finesResult = await db.query("SELECT f.*, u.name as user_name, v.license_plate as vehicle_number, t.entry_time as issue_date FROM fines f JOIN tickets t ON f.ticket_id = t.ticket_id JOIN users u ON t.user_id = u.user_id LEFT JOIN vehicles v ON t.vehicle_id = v.vehicle_id ORDER BY t.entry_time DESC");
    const usersResult = await db.query("SELECT user_id, name FROM users ORDER BY name");
    const vehiclesResult = await db.query("SELECT vehicle_id, license_plate FROM vehicles ORDER BY license_plate");
    res.render("issue_fine.ejs", {
      username: req.user.name, 
      fines: finesResult.rows,
      users: usersResult.rows,
      vehicles: vehiclesResult.rows,
      messages: req.flash() 
    });
  } catch (err) {
    console.error("Error fetching data for issue_fine page:", err);
    res.status(500).send("Error loading page");
  }
});


app.post("/issue_fine", ensureAuthenticated, ensureEmployee, async (req, res) => {
  try {
    const { user_id, vehicle_id, reason, amount } = req.body;

    
    const ticketResult = await db.query(
      "INSERT INTO tickets (user_id, vehicle_id, entry_time) VALUES ($1, $2, NOW()) RETURNING ticket_id",
      [user_id, vehicle_id || null]
    );
    
    const ticketId = ticketResult.rows[0].ticket_id;
    
    
    await db.query(
      "INSERT INTO fines (ticket_id, reason, amount, status) VALUES ($1, $2, $3, $4)",
      [ticketId, reason, amount, "Unpaid"]
    );

  
    await db.query(
      "INSERT INTO logs (user_id, admin_id, action, timestamp) VALUES ($1, $2, $3, NOW())",
      [user_id, req.user.user_id, `Fine issued for ${reason}: ₹${amount}`]
    );

    req.flash("success", "Fine has been issued successfully!");
    res.redirect("/issue_fine");
  } catch (err) {
    console.error("Error issuing fine:", err);
    req.flash("error", "Error issuing fine: " + err.message);
    res.redirect("/issue_fine");
  }
});

app.get("/revenue", ensureAuthenticated, ensureEmployee, (req, res) => {
    res.render("revenue.ejs", { username: req.user.name });
});
app.get("/api/revenue", async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT 
        date,
        total_parking_fees,
        total_fines,
        total_reservations,
        total_revenue
      FROM "Daily_Revenue"
      ORDER BY date
    `);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching revenue data:", err);
    res.status(500).send("Server error");
  }
});

//PAY MONEY
app.get("/payment_gateway", (req, res) => { 
    res.render("payment_gateway.ejs");
});

app.get("/open-lot", async (req, res) => {
  const selectedLot = req.query.lot_id; 
  try {
    const result = await db.query(
      `SELECT space_id, is_occupied FROM spaces WHERE lot_id = $1 ORDER BY space_id`,
      [selectedLot]
    );

    const spaces = result.rows;
    res.render("spaces.ejs", {
      lot: selectedLot,
      spaces
    });
  } catch (err) {
    console.error("Error fetching spaces:", err);
    res.status(500).send("Server error");
  }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

app.get("/manage_users", ensureAuthenticated, ensureEmployee, (req, res) => {
  db.query("SELECT user_id, name, email, phone_number FROM users WHERE role = 'user' ORDER BY name", (err, result) => {
    if (err) {
      console.error("Error fetching users:", err);
      return res.status(500).send("Error fetching users");
    }
    res.render("manage_user.ejs", { 
      users: result.rows, 
      username: req.user.name 
    });
  });
});


app.get("/manage_user_manage", ensureAuthenticated, async (req, res) => {
  const userId = req.query.user_id;
  if (!userId) {
    req.flash("error", "User ID is missing.");
    return res.redirect("/manage_user");
  }
  try {
    const userQuery = db.query(
      `SELECT user_id, name, email, phone FROM "users" WHERE user_id = $1`,
      [userId]
    );

    const vehiclesQuery = db.query(`
      SELECT 
        v.model, 
        v.is_parked, 
        ps.lot_name AS lot,
        ps.space_number AS space_id
      FROM vehicles v
      LEFT JOIN parking_sessions ps ON v.vehicle_id = ps.vehicle_id AND ps.end_time IS NULL
      WHERE v.user_id = $1
    `, [userId]);

    const [userResult, vehiclesResult] = await Promise.all([userQuery, vehiclesQuery]);

    if (userResult.rows.length === 0) {
      req.flash("error", "User not found.");
      return res.redirect("/manage_user");
    }
    const user = userResult.rows[0];

    res.render("manage_user_manage.ejs", {
      user: user,
      vehicles: vehiclesResult.rows,
      username: req.user.name
    });
  } catch (err) {
    console.error("Error fetching user details or vehicles for management:", err);
    req.flash("error", "Error loading user management page.");
    res.redirect("/manage_user");
  }
});
