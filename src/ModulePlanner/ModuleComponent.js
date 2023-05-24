import { Autocomplete, Button, TableCell, TableRow, TextField } from "@mui/material";


export function ModuleComponent({
  index,
  updateModule,
  getModuleId,
  deleteModule,
}) {

  const mods = [
    { title: '', code: '', id: 0, mc: 0 },
    { title: 'CS1010', code: 'CS', id: 1, mc: 4  },
    { title: 'CS1010S', code: 'CS', id: 3, mc: 4  },
    { title: 'CS1010J', code: 'CS', id: 2, mc: 4 },
    { title: 'CS1101S', code: 'CS', id: 4, mc: 4 },
    { title: 'IS1108', code: 'IS', id: 11, mc: 4 },
    { title: 'GEC1000', code: 'GEC', id: 6, mc: 4 },
    { title: 'GEC1001', code: 'GEC', id: 7, mc: 4 },
    { title: 'GEX1000', code: 'GEX', id: 9, mc: 4 },
    { title: 'GEX1001', code: 'GEX', id: 10, mc: 4 },
    { title: 'GEA1000', code: 'GEA', id: 5, mc: 4 },
    { title: 'GEI1000', code: 'GEI', id: 8, mc: 4 },
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