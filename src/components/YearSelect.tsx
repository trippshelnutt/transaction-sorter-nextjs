import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';

interface YearSelectProps {
  year: number;
  handleChange: (event: SelectChangeEvent<number>) => void;
}

export default function YearSelect(props: YearSelectProps) {
  const { year, handleChange } = props;

  const currentYear = new Date().getFullYear();

  const yearData = [
    { value: currentYear, name: `${currentYear}` },
    { value: currentYear - 1, name: `${currentYear - 1}` },
    { value: currentYear - 2, name: `${currentYear - 2}` },
  ];

  return (
    <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">Year</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={year}
        label="Year"
        onChange={handleChange}
      >
        {yearData.map((item, index) => (
          <MenuItem key={index} value={item.value}>
            {item.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
