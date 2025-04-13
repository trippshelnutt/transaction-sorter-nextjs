import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';

interface MonthSelectProps {
  month: number;
  handleChange: (event: SelectChangeEvent<number>) => void;
}

export default function MonthSelect(props: MonthSelectProps) {
  const { month, handleChange } = props;

  const monthData = [
    { value: 1, name: 'January' },
    { value: 2, name: 'February' },
    { value: 3, name: 'March' },
    { value: 4, name: 'April' },
    { value: 5, name: 'May' },
    { value: 6, name: 'June' },
    { value: 7, name: 'July' },
    { value: 8, name: 'August' },
    { value: 9, name: 'September' },
    { value: 10, name: 'October' },
    { value: 11, name: 'November' },
    { value: 12, name: 'December' },
  ];

  return (
    <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">Month</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={month}
        label="Month"
        onChange={handleChange}
      >
        {monthData.map((month) => (
          <MenuItem key={month.value} value={month.value}>
            {month.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
