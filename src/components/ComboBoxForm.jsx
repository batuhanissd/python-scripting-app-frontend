import * as React from 'react';
import CancelIcon from '@mui/icons-material/Cancel';
import { FormControl, InputLabel, MenuItem, Select, OutlinedInput, Chip, IconButton, Box } from "@mui/material";

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

//export default function ({ title, options, value, onChange, multipleChoice = false }) {
export default function ({ title, options, multipleChoice = false }) {
    //const theme = useTheme();
    const [selectedItems, setSelectedItems] = React.useState([]);

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setSelectedItems(typeof value === 'string' ? value.split(',') : value);
    };

    const handleDelete = (itemToDelete) => {
        setSelectedItems((prev) => prev.filter((item) => item !== itemToDelete));
    };

    return (
        <div>

            <FormControl sx={{ m: 1, width: 280, flexGrow: 1 }}>
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
                            {selected.map((value) => (
                                <Chip
                                    key={value}
                                    label={value}
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
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}
