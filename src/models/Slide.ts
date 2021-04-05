import { ISlideHead } from "./contracts/ISlide";
import { IContent, SlideType } from "./contracts/Other";
import React, { ReactElement } from "react";

export class Slide<T extends IContent> implements ISlideHead {
	constructor(
		public title: string,
		public order: number,

		private content: T,

		public slideType?: SlideType,
	) {}

	public toSlideHead(): ISlideHead {
		//TODO: Test this
		const slideHead: ISlideHead = {
			...this,
		};

		return this as ISlideHead;
	}

	public getThumbnail(): JSX.Element {
		return this.content.getThumbnail();
	}
}
