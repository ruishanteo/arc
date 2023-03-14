import { TableCell, TextField, Button } from "@mui/material";

const min = 0;
const max = 100;

export function AssessmentComponent({
  index,
  updateText,
  getText,
  deleteComponent,
}) {
  function onChange(value, dataKey) {
    updateText(index, dataKey, value);
  }

  return (
    <>
      <TableCell align="center">
        <Button
          type="button"
          onClick={() => deleteComponent(index)}
          sx={{ backgroundColor: "#fcf4d4", color: "black" }}
        >
          —
        </Button>
      </TableCell>

      <TableCell align="center">
        <TextField
          placeholder={`Assessment `}
          sx={{
            width: { sm: 200, md: 250 },
            "& .MuiInputBase-root": {
              height: 50,
            },
          }}
          type="text"
          id="component"
        />
      </TableCell>

      <TableCell align="center">
        <TextField
          sx={{
            width: { sm: 100, md: 150 },
            "& .MuiInputBase-root": {
              height: 50,
            },
          }}
          type="number"
          value={getText(index, "score")}
          onChange={(event) => {
            var value = parseInt(event.target.value, 10);

            if (value < min) value = min;

            onChange(value, "score");
          }}
          inputProps={{ min, max }}
        />
      </TableCell>

      <TableCell align="center">
        <TextField
          sx={{
            width: { sm: 100, md: 150 },
            "& .MuiInputBase-root": {
              height: 50,
            },
          }}
          type="number"
          value={getText(index, "total")}
          onChange={(event) => {
            var value = parseInt(event.target.value, 10);

            if (value < min) value = min;

            onChange(value, "total");
          }}
          inputProps={{ min, max }}
        />
      </TableCell>

      <TableCell align="center">
        <TextField
          sx={{
            width: { sm: 100, md: 150 },
            "& .MuiInputBase-root": {
              height: 50,
            },
          }}
          type="number"
          value={getText(index, "weight")}
          onChange={(event) => {
            var value = parseInt(event.target.value, 10);

            if (value > max) value = max;
            if (value < min) value = min;

            onChange(value, "weight");
          }}
          inputProps={{ min, max }}
        />
      </TableCell>
    </>
  );
}
