import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import CancelIcon from '@mui/icons-material/Cancel';

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

export default function ComboBoxForm({ title, options }) {
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

            <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel id="multi-select-label">{title}</InputLabel>
                <Select
                    labelId="multi-select-label"
                    id="multi-select"
                    multiple
                    value={selectedItems}
                    onChange={handleChange}
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






// import React from "react";
// import "./ComboBoxForm.css";

// const ComboBoxForm = ({ label, options }) => {
//     return (
//         <div className="combo-box">
//             <label>{label}</label>
//             <select>
//                 {options.map((option, index) => (
//                     <option key={index} value={option}>{option}</option>
//                 ))}
//             </select>
//         </div>
//     );
// };

// export default ComboBoxForm;