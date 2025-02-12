const Pegawai = require('../models/pegawaiModel');
const generateQrCode = require('../models/qrCodeModel');
// Mendapatkan semua data pegawai
const getPegawai = (req, res) => {
  Pegawai.getAllPegawaiModel((err, results) => {
    if (err) {
      res.status(500).json({ error: 'Failed to get pegawai' });
    } else {
      res.status(200).json(results);
    }
  });
};
const getPegawaiById = (req, res) => {
  const id_pegawai = req.params.id_pegawai;

  Pegawai.getPegawaiByIdModel(id_pegawai, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Failed to get pegawai' });
    } else {
      res.status(200).json(results);
    }
  });
};

// Menambah pegawai baru
const createPegawai = (req, res) => {
  const newPegawai = req.body;
  Pegawai.addPegawaiModel(newPegawai, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Failed to add pegawai' });
    } else {
      res.status(201).json({ message: 'Pegawai added successfully', id: results.insertId });
    }
  });
};
const putPegawai = (req, res) => {
  const updatedPegawai = req.body;
  const id_pegawai = req.params.id_pegawai; // Ini seharusnya diambil dari URL parameter

  console.log('Data yang akan diperbarui:', updatedPegawai);
  console.log('ID Pegawai:', id_pegawai);

  if (!id_pegawai) {
    return res.status(400).json({ error: 'ID pegawai tidak disediakan' });
  }

  Pegawai.updatePegawaiModel({ ...updatedPegawai, id_pegawai }, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Failed to update pegawai' });
    } else {
      res.status(200).json({ message: 'Pegawai updated successfully' });
    }
  });
};

const deletePegawai = (req, res) => {
  const id_pegawai = req.params.id_pegawai;
  
  Pegawai.deletePegawaiModel(id_pegawai, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Failed to delete pegawai' });
    } else {
      res.status(200).json({ message: 'Pegawai deleted successfully' });
    }
  });
};
const createQrForPegawai = async (req, res) => {
  const id_pegawai = req.params.id_pegawai;

  console.log(`Received request for ID: ${id_pegawai}`);

  // Ambil data pegawai dari database berdasarkan ID
  Pegawai.getPegawaiByIdModel(id_pegawai, async (err, results) => {
    if (err) {
      console.error('Error fetching pegawai:', err.message);
      return res.status(500).json({ error: 'Failed to fetch pegawai' });
    }

    console.log('Results from database:', results);

    const pegawai = results[0]; // Asumsikan hanya satu pegawai
    if (!pegawai) {
      console.log('Pegawai not found');
      return res.status(404).json({ error: 'Pegawai not found' });
    }

    console.log('Pegawai found:', pegawai);

    // Buat data unik untuk QR code, misalnya menggabungkan nama dan ID pegawai
    const data = `{
    "nama":"${pegawai.nama}",
    "validKey":"${pegawai.validKey}"
}`;
    console.log(`Data for QR Code: ${data}`);

    try {
      // Panggil generateQrCodeModel untuk menghasilkan QR code
      const qrCodeUrl = await generateQrCode.generateQrCodeModel(data);
      console.log('QR Code generated successfully:', qrCodeUrl);

      // Return QR code URL sebagai respons
      return res.status(200).json({ qrCode: qrCodeUrl });
    } catch (err) {
      console.error('Error generating QR code:', err.message);
      return res.status(500).json({ error: 'Failed to generate QR code' });
    }
  });
};
const absenPegawai = (req, res) => {
  const data = req.body;

  // Pastikan ID pegawai disediakan dalam request body
  if (!data.validKey) {
    return res.status(400).json({ message: 'validKey pegawai harus disediakan.' });
  }

  // Panggil model untuk melakukan absensi pegawai
  Pegawai.absenPegawaiModel(data, (err, result) => {
    if (err) {
      // Jika ada error, tangani error dan kirimkan respon error
      return res.status(500).json({ message: err.message });
    }

    // Jika berhasil, kirimkan respon sukses
    return res.status(200).json({
      message: 'Absensi berhasil dilakukan.',
      data: result,
    });
  });
};
const getAbsenPegawai = (req, res) => {
  console.log('API getAbsenPegawai dipanggil'); // Tambahkan log ini
  
  Pegawai.absenPegawaiGetModel((err, results) => {
    if (err) {
      console.error('Error in getAbsenPegawai:', err);
      return res.status(500).json({ error: err.message });
    }
    
    console.log('Results from database:', results);
    res.status(200).json({ data: results });
  });
};
const getAbsenPegawaiByQuery = (req, res) => {
  const queryTipe = req.params.queryTipe;

  Pegawai.getAbsenPegawaiByQueryModel(queryTipe, (err, results) => {
    if (err) {
      // Jika terjadi error, kembalikan status 400 atau 500 sesuai error
      const statusCode = err.message === 'Tipe query tidak valid' ? 400 : 500;
      return res.status(statusCode).json({ error: err.message });
    }

    // Jika berhasil, kembalikan hasilnya
    res.status(200).json({ data: results });
  });
};

module.exports = {
  getPegawai,
  getPegawaiById,
  createPegawai,
  putPegawai,
  deletePegawai,
  absenPegawai,
  getAbsenPegawai,
  getAbsenPegawaiByQuery,
  createQrForPegawai
};
