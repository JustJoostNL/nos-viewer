import React, { FC, useCallback, useState } from "react";
import { IconButton, Link, ListItemIcon } from "@mui/material";
import Menu from "@mui/material/Menu";
import { MoreVert, Home, StarRounded } from "@mui/icons-material";
import MenuItem from "@mui/material/MenuItem";

export const NavbarMenu: FC = () => {
  const [anchorEl, setAnchorEl] = useState<undefined | HTMLElement>(undefined);

  const handleMenuOpenClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    },
    [],
  );
  const handleMenuClose = useCallback(() => {
    setAnchorEl(undefined);
  }, []);

  return (
    <>
      <IconButton color="inherit" onClick={handleMenuOpenClick}>
        <MoreVert />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose} component={Link} href="#/home">
          <ListItemIcon>
            <Home />
          </ListItemIcon>
          Home
        </MenuItem>

        <MenuItem onClick={handleMenuClose} component={Link} href="#/favorites">
          <ListItemIcon>
            <StarRounded />
          </ListItemIcon>
          Favorites
        </MenuItem>
      </Menu>
    </>
  );
};
