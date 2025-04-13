import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';

interface CategorySelectProps {
  category: string;
  handleChange: (event: SelectChangeEvent<string>) => void;
}

export default function CategorySelect(props: CategorySelectProps) {
  const { category, handleChange } = props;

  return (
    <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">Category</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={category}
        label="Category"
        onChange={handleChange}
      >
        <MenuItem value={'Tripp'}>Allowance - Tripp</MenuItem>
        <MenuItem value={'Missy'}>Allowance - Missy</MenuItem>
        <MenuItem value={'DiningOut'}>Spending - Dining Out</MenuItem>
        <MenuItem value={'Groceries'}>Spending - Groceries</MenuItem>
        <MenuItem value={'Supplies'}>Spending - Supplies</MenuItem>
      </Select>
    </FormControl>
  );
}
