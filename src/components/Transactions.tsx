'use client';

import React from 'react';

import { SelectChangeEvent } from '@mui/material';
import Button from '@mui/material/Button';

import CategorySelect from './CategorySelect';
import MonthSelect from './MonthSelect';
import TransactionTable from './TransactionTable';
import './Transactions.css';
import YearSelect from './YearSelect';

export default function App() {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const [rows, setRows] = React.useState<[]>([]);
  const [category, setCategory] = React.useState('Tripp');
  const [month, setMonth] = React.useState(currentMonth);
  const [year, setYear] = React.useState(currentYear);

  const handleFetchClicked = async () => {
    const apiUrl = new URL(
      `/Prod/api/transactions/${category}/${year}/${month}`,
      'https://d06jy95pk9.execute-api.us-east-1.amazonaws.com'
    );
    console.log(apiUrl.href);
    const response = await fetch(apiUrl.href);
    const data = await response.json();

    setRows(data);
  };

  const handleClearClicked = () => {
    setRows([]);
  };

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    setCategory(event.target.value);
  };

  const handleMonthChange = (event: SelectChangeEvent<number>) => {
    setMonth(event.target.value as number);
  };

  const handleYearChange = (event: SelectChangeEvent<number>) => {
    setYear(event.target.value as number);
  };

  return (
    <section className="app-section">
      <div className="app-selection">
        <CategorySelect category={category} handleChange={handleCategoryChange} />
        <MonthSelect month={month} handleChange={handleMonthChange} />
        <YearSelect year={year} handleChange={handleYearChange} />
        <Button variant="contained" onClick={handleFetchClicked}>
          Fetch
        </Button>
        <Button variant="contained" onClick={handleClearClicked}>
          Clear
        </Button>
      </div>
      <TransactionTable rows={rows} />
    </section>
  );
}
