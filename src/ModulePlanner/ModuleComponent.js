import { Autocomplete, Button, TableCell, TableRow, TextField } from "@mui/material";


export function ModuleComponent({
  index,
  updateModule,
  getModuleId,
  deleteModule,
}) {

  const mods = [
    { title: '', code: '', id: 0 },
    { title: 'CS1010', code: 'CS', id: 1 },
    { title: 'CS1010S', code: 'CS', id: 3 },
    { title: 'CS1010E', code: 'CS', id: 2},
    { title: 'CS1101S', code: 'CS', id: 4}
   ]

  function onChange(value) {
    updateModule(index, value);
  }

  return (
    <>
      <TableCell align="center">
        <Button
          type="button"
          onClick={() => deleteModule(index)}
          sx={{ backgroundColor: "#fcf4d4", color: "black" }}
        >
          —
        </Button>
      </TableCell>

      <TableCell align="center">
        <Autocomplete
            disablePortal
            id="module-selector"           
            options={mods.sort((a, b) => -b.title.localeCompare(a.title))}
            groupBy={(mods) => mods.code}
            getOptionLabel={(mods) => mods.title}
            sx={{ width: 300 }}
            value={mods[getModuleId(index)]  || null}
            onChange={(_, value) => {
              onChange(value);
            }}
            renderInput={(params) => <TextField {...params} label="Select Module" />}
            />
      </TableCell>
    </>
  );
}