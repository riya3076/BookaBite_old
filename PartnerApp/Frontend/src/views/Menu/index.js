import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Box,
  Grid,
  Button,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Modal,
  TextField,
  IconButton,
  Typography,
  Switch,
  Chip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import axios from "axios";
import CustomBackdrop from "../../utils/Backdrop";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const apiBaseUrl =
  "https://prb29cpvt2.execute-api.us-east-1.amazonaws.com/dev/";
// "https://3ithnk2mg5.execute-api.us-east-1.amazonaws.com/dev/";

const MenuItemRow = ({
  item,
  onEdit,
  onDelete,
  onToggle,
  isEditing,
  onEditChange,
  onUpdateImage,
}) => {
  const [isAvailable, setIsAvailable] = useState(
    item.menu_item_availability === "available"
  );
  const [editableItem, setEditableItem] = useState({ ...item });
  const [imageSrc, setImageSrc] = useState(item.menu_image);
  const fileInputRef = useRef(null);

  const handleToggle = (event) => {
    setIsAvailable(event.target.checked);
    onToggle(item.menu_item_id, event.target.checked);
  };

  const handleChange = (event, field) => {
    setEditableItem({ ...editableItem, [field]: event.target.value });
    onEditChange(item.menu_item_id, {
      ...editableItem,
      [field]: event.target.value,
    });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setImageSrc(base64String);
        onUpdateImage(item.menu_item_id, base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <TableRow style={{ height: "100px" }}>
      <TableCell style={{ textAlign: "center", verticalAlign: "middle" }}>
        <img
          src={imageSrc}
          alt={editableItem.menu_item_name}
          style={{ width: "80px", height: "80px", marginBottom: "10px" }}
        />
        {isEditing && (
          <>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              style={{ display: "none" }}
              accept="image/*"
            />
            <Button
              variant="contained"
              startIcon={<CloudUploadIcon />}
              size="small"
              style={{ display: "inline-block" }}
              onClick={() => fileInputRef.current.click()}
            >
              Upload
            </Button>
          </>
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <TextField
            value={editableItem.menu_item_name}
            onChange={(e) => handleChange(e, "menu_item_name")}
          />
        ) : (
          item.menu_item_name
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <TextField
            value={editableItem.menu_ingrediants}
            onChange={(e) => handleChange(e, "menu_ingrediants")}
          />
        ) : (
          item.menu_ingrediants
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <TextField
            type="number"
            value={editableItem.menu_price}
            onChange={(e) => handleChange(e, "menu_price")}
          />
        ) : (
          "$" + item.menu_price
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <TextField
            // type="number"
            value={editableItem.menu_offer}
            onChange={(e) => handleChange(e, "menu_offer")}
          />
        ) : item.menu_offer && item.menu_offer !== "" ? (
          <Typography component="span" sx={{ color: "red" }}>
            {item.menu_offer}
          </Typography>
        ) : (
          <Typography component="span" sx={{ color: "grey" }}>
            N/A
          </Typography>
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Switch checked={isAvailable} onChange={handleToggle} />
        ) : item.menu_item_availability == "available" ? (
          <Chip label={item.menu_item_availability} color="primary" />
        ) : (
          <Chip label={item.menu_item_availability} color="secondary" />
        )}
      </TableCell>
      {isEditing && (
        <TableCell>
          <IconButton onClick={() => onDelete(item.menu_item_id)}>
            <DeleteIcon />
          </IconButton>
        </TableCell>
      )}
    </TableRow>
  );
};

const RestaurantMenuPage = () => {
  const [menuData, setMenuData] = useState([]);
  const [data, setData] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [restaurantId, setRestaurantId] = useState(null);
  const [imageUpdates, setImageUpdates] = useState([]);

  const [backdrop, setBackdrop] = React.useState(true);

  const [isMainOffersModalOpen, setIsMainOffersModalOpen] = useState(false);
  const [mainOffer, setMainOffer] = useState("");

  const navigate = useNavigate();

  const handleOpenMainOffersModal = () => {
    setIsMainOffersModalOpen(true);
  };

  const handleCloseMainOffersModal = () => {
    setIsMainOffersModalOpen(false);
  };

  const handleSaveMainOffer = async () => {
    console.log("Main Offer:", mainOffer);
    setBackdrop(true);
    try {
      const payload = {
        restaurant_id: restaurantId,
        restaurant_offers: mainOffer,
      };

      const response = await axios.post(
        apiBaseUrl + "update-menu-offers",
        payload
      );
      setBackdrop(false);
      console.log(response.data);
    } catch (error) {
      setBackdrop(false);
      console.error("Error saving data:", error);
    }

    setIsMainOffersModalOpen(false);
  };

  const fetchMenuData = async (restaurantId) => {
    try {
      const response = await axios.post(apiBaseUrl + "get-menu", {
        restaurant_id: restaurantId,
      });
      if (
        response.data &&
        response.data.statusCode == 200 &&
        response.data.body &&
        response.data.body.restaurant_food_menu
      ) {
        console.log(response);
        setData(response.data.body);
        setMenuData(response.data.body.restaurant_food_menu);
        setMainOffer(response.data.body.restaurant_offers);
      }
      setBackdrop(false);
    } catch (error) {
      console.error("Error fetching menu data:", error);
      setBackdrop(false);
    }
  };

  useEffect(() => {
    setBackdrop(true);
    const restaurantId = localStorage.getItem("restaurant_id");
    if (restaurantId) {
      console.log(restaurantId);
      setRestaurantId(restaurantId);
      fetchMenuData(restaurantId);
    } else {
      navigate("/login");
    }
  }, [setData]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    setBackdrop(true);
    try {
      const payload = {
        restaurant_id: restaurantId,
        menuData: menuData,
        imageUpdates: imageUpdates,
      };

      const response = await axios.post(apiBaseUrl + "save-menu", payload);
      setBackdrop(false);
      console.log(response.data);
      // Handle the response as needed
    } catch (error) {
      setBackdrop(false);
      console.error("Error saving data:", error);
      // Handle error appropriately
    }
    handleEditToggle();
  };

  const handleEditChange = (itemId, updatedItem) => {
    const updatedMenu = menuData.map((item) =>
      item.menu_item_id === itemId ? updatedItem : item
    );
    setMenuData(updatedMenu);
  };

  const handleEditOpen = (item) => {
    setCurrentEditItem(item);
    setOpenEditModal(true);
  };

  const handleEditClose = () => {
    setOpenEditModal(false);
    setCurrentEditItem(null);
  };

  const handleDeleteOpen = (itemId) => {
    setDeleteItemId(itemId);
    setOpenDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    const updatedMenu = menuData.filter(
      (item) => item.menu_item_id !== deleteItemId
    );
    setMenuData(updatedMenu);
    handleDeleteClose();
  };

  const handleDeleteClose = () => {
    setOpenDeleteModal(false);
  };

  const toggleMenuItemAvailability = (itemId, isAvailable) => {
    console.log("Toggling availability for item", itemId, isAvailable);

    setMenuData((prevMenuData) =>
      prevMenuData.map((item) => {
        if (item.menu_item_id === itemId) {
          return {
            ...item,
            menu_item_availability: isAvailable ? "available" : "unavailable",
          };
        }
        return item;
      })
    );
  };

  const onUpdateImage = (itemId, newImageBase64) => {
    const existingUpdateIndex = imageUpdates.findIndex(
      (update) => update.menu_item_id === itemId
    );

    if (existingUpdateIndex > -1) {
      const newImageUpdates = [...imageUpdates];
      newImageUpdates[existingUpdateIndex] = {
        menu_item_id: itemId,
        menu_image_base64: newImageBase64,
      };
      setImageUpdates(newImageUpdates);
    } else {
      setImageUpdates((prev) => [
        ...prev,
        { menu_item_id: itemId, menu_image_base64: newImageBase64 },
      ]);
    }
  };

  return (
    <>
      {data && (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Box sx={{ width: "100%", marginBottom: 2 }}>
            <Grid
              container
              spacing={2}
              justifyContent="space-between"
              alignItems="center"
            >
              <Grid item xs={8}>
                <Typography variant="h4" gutterBottom>
                  {data.restaurant_name} Menu
                </Typography>
                <Typography variant="subtitle1">
                  {data.restaurant_location}
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleEditToggle}
                >
                  {isEditing ? "Cancel Edit" : "Edit Menu"}
                </Button>
              </Grid>
              <Grid item xs={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleOpenMainOffersModal}
                >
                  Main Offer
                </Button>
              </Grid>
            </Grid>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Image</TableCell>
                  <TableCell>Item Name</TableCell>
                  <TableCell>Ingredients</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Offers</TableCell>
                  <TableCell>Available</TableCell>
                  {isEditing && <TableCell>Delete</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {menuData.map((item) => (
                  <MenuItemRow
                    key={item.menu_item_id}
                    item={item}
                    onEdit={handleEditOpen}
                    onDelete={handleDeleteOpen}
                    onToggle={toggleMenuItemAvailability}
                    isEditing={isEditing}
                    onEditChange={handleEditChange}
                    onUpdateImage={onUpdateImage}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {isEditing && (
            <Box mt={2}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleSave}
              >
                Save Changes
              </Button>
            </Box>
          )}

          <Modal
            open={openDeleteModal}
            onClose={handleDeleteClose}
            aria-labelledby="delete-confirm-modal"
            aria-describedby="delete-confirm-modal-description"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              p={2}
              style={{
                width: "auto",
                minWidth: "300px",
                maxWidth: "90%",
              }}
            >
              <Paper style={{ padding: "20px", textAlign: "center" }}>
                <Typography id="delete-confirm-modal" variant="h6" mb={2}>
                  Are you sure you want to delete this item?
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleDeleteConfirm}
                >
                  Yes
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleDeleteClose}
                  sx={{ ml: 2 }}
                >
                  No
                </Button>
              </Paper>
            </Box>
          </Modal>
          <Modal
            open={isMainOffersModalOpen}
            onClose={handleCloseMainOffersModal}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box p={2} style={{ width: 500 }}>
              <Paper style={{ padding: "40px", textAlign: "center" }}>
                <Typography variant="h4" mb={1}>
                  Main Offer
                </Typography>
                <Typography variant="h6" mb={1}>
                  Enter the offer that will be applied to the entire menu
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  value={mainOffer}
                  onChange={(e) => setMainOffer(e.target.value)}
                  sx={{ marginBottom: "20px" }}
                  multiline
                  rows={4}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSaveMainOffer}
                  style={{ marginRight: "10px" }}
                >
                  Save
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleCloseMainOffersModal}
                >
                  Cancel
                </Button>
              </Paper>
            </Box>
          </Modal>
        </Container>
      )}

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={backdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default RestaurantMenuPage;
