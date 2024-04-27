const express = require('express');
const multer = require('multer');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/authorizationMiddleware');
const { updateUserRole } = require('../controllers/auth/authController'); 
const { uploadDocument, checkDocumentsUploaded } = require('../controllers/user/userController');


// Configurar Multer para guardar archivos en carpetas diferentes según su tipo
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      let destinationFolder;
      if (file.fieldname === 'profileImage') {
        destinationFolder = './uploads/profiles/';
      } else if (file.fieldname === 'productImage') {
        destinationFolder = './uploads/products/';
      } else if (file.fieldname === 'document') {
        destinationFolder = './uploads/documents/';
      }
      cb(null, destinationFolder);
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  });
  const upload = multer({ storage: storage });


// Endpoint para subir documentos
router.post('/:uid/documents', isAuthenticated, upload.array('documents'), uploadDocument);

// Endpoint para verificar si el usuario ha cargado todos los documentos requeridos
router.get('/:uid/check-documents', isAuthenticated, checkDocumentsUploaded);

// Endpoint para actualizar a usuario premium
router.put('/premium/:uid', isAuthenticated, updateUserRole); 

module.exports = router;

