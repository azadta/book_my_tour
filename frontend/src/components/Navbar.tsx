"use client";

import * as React from "react";
import { Link } from "react-router-dom";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "../components/ui/navigation-menu";
import { useHome } from "@/hooks/useHome";

export function Navigation() {
  const { packages } = useHome();
  const uniqueDestinations = Array.from(
    new Map(
      packages
        .flatMap((pkg) => pkg.destinations)
        .map((destination) => [destination._id, destination]),
    ).values(),
  );

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-orange-900 text-[15px]">
            Destinations
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="w-50  bg-white ">
              {uniqueDestinations.map((dest) => (
                <ListItem
                  key={dest._id}
                  title={dest.name}
                  href={`/user/packages-list?destination=${dest._id}&destinationName=${dest.name}`}
                />
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem className="hidden md:flex">
          <NavigationMenuTrigger className="text-orange-900  text-[15px]">
            Packages
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[550px] bg-white ">
              {packages.map((pkg) => (
                <ListItem
                  key={pkg._id}
                  title={pkg.name}
                  href={`/user/package-details/${pkg._id}`}
                ></ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link to="/docs" className="text-orange-900  text-[15px]">
              Offers
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link to={href}>
          <div className="flex flex-col gap-1 text-sm">
            <div className="leading-none font-medium ">{title}</div>
            <div className="line-clamp-2 text-muted-foreground">{children}</div>
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
