import React from "react";
import { Modal, Box, Typography, Grid } from "@mui/material";
import { RxCross2 } from "react-icons/rx";

const GalleryPopup = ({
  modalOpen,
  handleCloseModal,
  handleSelectImage,
  images,
}) => {
  return (
    <Modal open={modalOpen} onClose={handleCloseModal}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 600 },
          maxHeight: "80vh",
          bgcolor: "white",
          boxShadow: 24,
          p: 2,
          display: "flex",
          flexDirection: "column",
        }}>
        <Box sx={{ position: "relative", mb: 2 }}>
          <RxCross2
            onClick={handleCloseModal}
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              cursor: "pointer",
            }}
          />
          <Typography
            variant="h5"
            sx={{
              textAlign: "left",
              mb: 1,
            }}>
            Select a design to link
          </Typography>
          <hr style={{ margin: "16px 0", opacity: "50%" }} />
        </Box>
        <Box sx={{ overflowY: "auto", maxHeight: "calc(80vh - 48px)" }}>
          <Grid container spacing={2}>
            {images?.map((image, index) => (
              <Grid item xs={3} key={index}>
                <img
                  src={image}
                  alt={`Image ${index + 1}`}
                  style={{
                    width: "90%",
                    height: "80%",
                    cursor: "pointer",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                  }}
                  onClick={() =>
                    handleSelectImage({
                      src: image,
                      name: `Image ${index + 1}`,
                    })
                  }
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Modal>
  );
};

export default GalleryPopup;
