import * as React from "react";

import { addNode, cn } from "@/lib/utils";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { AlignJustify } from "lucide-react";
import { storeSelector, useSettings, useStore, useTheme } from "@/hooks";
import { NavItem, NodeType } from "@/lib/types";
import { shallow } from "zustand/shallow";

const navItems: NavItem[] = [
  {
    title: "Function",
    subtitle: "Add new function to editor",
    children: [
      {
        title: "Block",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quibusdam, laboriosam!",
        nodeType: NodeType.Block,
      },
      {
        title: "Connector",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quibusdam, laboriosam!",
        nodeType: NodeType.Connector,
      },
      {
        title: "Terminal",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quibusdam, laboriosam!",
        nodeType: NodeType.Terminal,
      },
    ],
  },
  {
    title: "Product",
    subtitle: "Add new product to editor",
    children: [
      {
        title: "Block",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quibusdam, laboriosam!",
        nodeType: NodeType.Block,
      },
      {
        title: "Connector",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quibusdam, laboriosam!",
        nodeType: NodeType.Connector,
      },
      {
        title: "Terminal",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quibusdam, laboriosam!",
        nodeType: NodeType.Terminal,
      },
    ],
  },
  {
    title: "Location",
    subtitle: "Add new location to editor",
    children: [
      {
        title: "Block",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quibusdam, laboriosam!",
        nodeType: NodeType.Block,
      },
      {
        title: "Connector",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quibusdam, laboriosam!",
        nodeType: NodeType.Connector,
      },
      {
        title: "Terminal",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quibusdam, laboriosam!",
        nodeType: NodeType.Terminal,
      },
    ],
  },
];

const Navbar = () => {
  const { theme } = useTheme();
  const { openSettings } = useSettings();
  const { nodes, setNodes } = useStore(storeSelector, shallow);

  return (
    <NavigationMenu className="fixed backdrop-blur-md">
      <NavigationMenuList>
        <NavigationMenuItem className="p-5">
          <AlignJustify
            onClick={openSettings}
            className={cn("w-10 h-10 cursor-pointer", {
              "text-white": theme === "dark",
              "text-black": theme === "light",
            })}
          />
        </NavigationMenuItem>
        {navItems.map(node => (
          <NavigationMenuItem key={node.title}>
            <NavigationMenuTrigger>{node.title}</NavigationMenuTrigger>
            <NavigationMenuContent>
              <h1 className="text-muted-foreground p-4">{node.subtitle}</h1>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                {node.children.map(component => (
                  <ListItem
                    key={component.title}
                    title={component.title}
                    onClick={() => addNode(component.nodeType, nodes, setNodes)}
                  >
                    {component.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default Navbar;
