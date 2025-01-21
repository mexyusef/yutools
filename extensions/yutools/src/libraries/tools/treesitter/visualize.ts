const data = JSON.parse(document.getElementById('ast-data').textContent);

const svg = d3.select('svg');
const width = +svg.attr('width');
const height = +svg.attr('height');

const treeLayout = d3.tree().size([width, height]);
const root = d3.hierarchy(data);
treeLayout(root);

const link = svg
  .selectAll('.link')
  .data(root.links())
  .enter()
  .append('path')
  .attr('class', 'link')
  .attr('d', d3.linkHorizontal().x(d => d.y).y(d => d.x));

const node = svg
  .selectAll('.node')
  .data(root.descendants())
  .enter()
  .append('g')
  .attr('class', 'node')
  .attr('transform', d => `translate(${d.y},${d.x})`);

node.append('circle').attr('r', 5);
node.append('text').text(d => d.data.type).attr('x', 10).attr('y', 5);
