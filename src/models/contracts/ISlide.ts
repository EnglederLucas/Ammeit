import { SlideType } from "./Other";
import React, { ReactElement } from "react";

export interface ISlideHead {
	order: number;
	title: string;
	slideType?: SlideType;
	getThumbnail(): JSX.Element;
}
