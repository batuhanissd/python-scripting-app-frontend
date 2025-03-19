/* eslint-disable react-refresh/only-export-components */
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
  export default function ({ title, options, value = [], onChange, multipleChoice = false }) {
    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        onChange(Array.isArray(value) ? value : [value]); // Gelen değeri her zaman diziye çeviriyoruz
    };

    const handleDelete = (itemToDelete) => {
        onChange(value.filter((item) => item !== itemToDelete)); // Seçili elemanı kaldırıyoruz
    };

    return (
        <div>
            <FormControl sx={{ m: 1, width: 350, flexGrow: 1 }}>
                <InputLabel id="multi-select-label">{title}</InputLabel>
                <Select
                    labelId="multi-select-label"
                    id="multi-select"
                    value={value || []} // Boş dizi varsayılan olarak atanıyor
                    onChange={handleChange}
                    multiple={multipleChoice} // multiple true olduğunda value array olmalı
                    input={<OutlinedInput id="select-multiple-chip" label={title} />}
                    renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((item) => (
                                <Chip
                                    key={item.id}
                                    label={item.name}
                                    onDelete={() => handleDelete(item)}
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
