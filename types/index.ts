export type CustomNode = {
  data: {
    color: string;
    id: string;
    label: string;
    type: string;
  };
  dragging: boolean;
  id: string;
  measured: {
    height: number;
    width: number;
  };
  position: {
    x: number;
    y: number;
  };
  selected: boolean;
  type: string;
};
