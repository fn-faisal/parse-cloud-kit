// jest.setup.js

// Mock the global Parse object
global.Parse = {
    Cloud: {
        define: jest.fn(),
        afterSave: jest.fn(),
        afterDelete: jest.fn(),
        afterDeleteFile: jest.fn(),
        afterSaveFile: jest.fn(),
        afterFind: jest.fn(),
        afterLogout: jest.fn(),
        afterLogin: jest.fn(),
        beforeSave: jest.fn(),
        beforeDelete: jest.fn(),
        beforeDeleteFile: jest.fn(),
        beforeLogin: jest.fn(),
        beforeSaveFile: jest.fn(),
        beforeFind: jest.fn(),
    },
  };
  