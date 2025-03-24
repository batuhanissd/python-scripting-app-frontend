import * as React from 'react';
import CancelIcon from '@mui/icons-material/Cancel';
import { FormControl, InputLabel, MenuItem, Select, OutlinedInput, Chip, IconButton, Box } from "@mui/material";
import { toast } from "react-toastify";


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

export default function ({ title, options, value, onChange, onDelete, multipleChoice = false }) {
    const [selectedItems, setSelectedItems] = React.useState(value || []);  // Başlangıçta gelen değeri kullan

    //Öge seçildiğinde state'lerde güncelleme yapar.
    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        const newValue = typeof value === 'string' ? value.split(',') : value;
        setSelectedItems(newValue);

        if (onChange) {
            onChange(newValue);
        }
    };

    const handleDelete = (itemToDelete) => {
        if (itemToDelete.name === "All Cameras") { //Mantıksal bir sorunun giderilmesi için bu if yazıldı.
            const filteredCameras = options.filter(cam => cam.id !== "all");
            if (filteredCameras.length === 0) {
                toast.warning("You cannot deselect the camera selection because all subnodes are selected.")
                return;
            }
        }
        setSelectedItems((prev) => prev.filter((item) => item !== itemToDelete));

        // Üst bileşene bildirir.
        if (onDelete) {
            onDelete(itemToDelete);

        }
    };

    React.useEffect(() => {
        setSelectedItems(value || []);
    }, [value]);

    return (
        <div>

            <FormControl sx={{ m: 1, width: 350, flexGrow: 1 }}>
                <InputLabel id="multi-select-label">{title}</InputLabel>
                <Select
                    labelId="multi-select-label"
                    id="multi-select"
                    value={selectedItems}
                    onChange={handleChange}
                    multiple={multipleChoice}
                    input={<OutlinedInput id="select-multiple-chip"
                        label={title}
                    />}
                    renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {/* {selected.map((value, index) => (    Process type eklenmeden önce buydu.*/}
                            {(Array.isArray(selected) ? selected : [selected]).map((value, index) => (
                                <Chip
                                    key={`${value.id}-${index}`}
                                    label={value.name}
                                    onDelete={() => handleDelete(value)}
                                    deleteIcon={
                                        <IconButton size="small" onMouseDown={(event) => event.stopPropagation()}>
                                            <CancelIcon fontSize="small" />
                                        </IconButton>
                                    }
                                />
                            ))}

                        </Box>
                    )}
                    MenuProps={MenuProps}
                >

                    {options.map((option) => (
                        <MenuItem key={option.id} value={option}>
                            {option.name}
                        </MenuItem>
                    ))}

                </Select>
            </FormControl>
        </div>
    );
}