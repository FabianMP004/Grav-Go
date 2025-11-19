// Script para actualizar todos los usuarios existentes a balance: 0
// Ejecutar con: node scripts/update-user-balances.js

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const connectDB = require('../db');

async function updateBalances() {
  try {
    await connectDB();

    // Actualizar todos los usuarios que no tienen balance o tienen balance diferente de 0
    const result = await User.updateMany(
      { $or: [{ balance: { $exists: false } }, { balance: { $ne: 0 } }] },
      { $set: { balance: 0 } }
    );

    console.log(`Actualizados ${result.modifiedCount} usuarios con balance: 0`);
    
    // Verificar que todos los usuarios tengan balance
    const usersWithoutBalance = await User.countDocuments({ balance: { $exists: false } });
    if (usersWithoutBalance > 0) {
      console.log(`Advertencia: ${usersWithoutBalance} usuarios aún no tienen balance definido`);
    } else {
      console.log('Todos los usuarios tienen balance definido');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

updateBalances();

