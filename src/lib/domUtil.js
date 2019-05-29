import parse5 from 'parse5';


const isTag = (elem) => {
  return elem.tagName === "tag" || elem.tagName === "script" || elem.tagName === "style";
}

export const findAll = ( root, test) => {
	var result = [];
	var stack = root.slice();
	while(stack.length){
    var elem = stack.shift();
		if(isTag(elem)) continue;
		if (elem.childNodes && elem.childNodes.length > 0) {
			stack.unshift.apply(stack, elem.childNodes);
		}
		if(test(elem)) result.push(elem);
	}
	return result;
}

export const getCodeCaption = (codeBlock) => {
  const rawCaption = codeBlock.childNodes.find(el => el.tagName === 'p');
  return rawCaption.childNodes.reduce((accum, item) => item.value ? accum + item.value : accum, '')
}

export const parse = (htmlText) => parse5.parseFragment(htmlText);

export const serialize = (dom) => parse5.serialize(dom);