
import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { Person, TreeType } from '../types';
import { generateNodeBio } from '../services/geminiService';

interface ExtendedPerson extends Person {
  isRevealed?: boolean;
  _children?: ExtendedPerson[] | null;
  children?: ExtendedPerson[] | null;
}

interface TreeVisualizerProps {
  data: Person;
  type: TreeType;
}

const TreeVisualizer: React.FC<TreeVisualizerProps> = ({ data, type }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  
  const [selectedNode, setSelectedNode] = useState<ExtendedPerson | null>(null);
  const [isSpouseSelected, setIsSpouseSelected] = useState(false);
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiInsight, setAiInsight] = useState('');
  const [isInitialRender, setIsInitialRender] = useState(true);

  // Helper to prepare nested data structure
  const prepareData = useCallback((node: Person): ExtendedPerson => {
    const newNode: ExtendedPerson = { ...node, isRevealed: false };
    if (node.children && node.children.length > 0) {
      newNode._children = node.children.map(child => prepareData(child));
      newNode.children = null; 
    } else {
      newNode._children = null;
      newNode.children = null;
    }
    return newNode;
  }, []);

  const [rootData, setRootData] = useState<ExtendedPerson>(() => {
    const root = prepareData(data);
    root.isRevealed = true;
    return root;
  });

  const [currentHierarchy, setCurrentHierarchy] = useState<d3.HierarchyPointNode<ExtendedPerson> | null>(null);

  useEffect(() => {
    const prepared = prepareData(data);
    prepared.isRevealed = true;
    
    // Auto-reveal root children if root is revealed (optional but good for UX)
    // However, logic below mainly handles click expansion. 
    // To ensure consistency, let's keep initial state simple.
    
    setRootData(prepared);
    setSelectedNode(prepared);
    setIsSpouseSelected(false);
    setIsInitialRender(true);
  }, [data, prepareData]);

  const centerNode = useCallback((x: number, y: number, scale?: number) => {
    if (!svgRef.current || !containerRef.current || !zoomRef.current) return;
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const svg = d3.select(svgRef.current);
    
    const currentTransform = d3.zoomTransform(svgRef.current);
    const targetScale = scale ?? currentTransform.k;
    
    const transform = d3.zoomIdentity
      .translate(width / 2 - x * targetScale, height / 2 - y * targetScale)
      .scale(targetScale);

    svg.transition()
      .duration(1000)
      .ease(d3.easeCubicOut)
      .call(zoomRef.current.transform, transform);
  }, []);

  const jumpToTop = () => {
    if (!currentHierarchy) return;
    centerNode(currentHierarchy.x, currentHierarchy.y, 1.0);
  };

  const jumpToBottom = () => {
    if (!currentHierarchy) return;
    const descendants = currentHierarchy.descendants();
    const deepest = descendants.reduce((prev, curr) => (curr.y > prev.y ? curr : prev), descendants[0]);
    centerNode(deepest.x, deepest.y, 1.0);
  };

  const renderTree = useCallback(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    if (width === 0 || height === 0) return;

    const svg = d3.select(svgRef.current);
    let g = svg.select<SVGGElement>('g.main-group');
    
    if (g.empty()) {
      g = svg.append('g').attr('class', 'main-group');
      const zoom = d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.1, 2.5])
        .on('zoom', (event) => {
          g.attr('transform', event.transform);
        });
      svg.call(zoom);
      zoomRef.current = zoom;
    }

    const theme = { color: '#3b82f6', bg: '#1d4ed8' };
    const isMobile = width < 768;
    
    // Increased horizontal gap to prevent overlapping branch names
    const horizontalGap = isMobile ? 450 : 850; 
    // Reduced vertical gap significantly to decrease line length
    const verticalGap = isMobile ? 250 : 400;

    const treeLayout = d3.tree<ExtendedPerson>().nodeSize([horizontalGap, verticalGap]);
    const root = treeLayout(d3.hierarchy(rootData));
    setCurrentHierarchy(root);

    if (isInitialRender) {
      // Reduced initial scale for better overview
      const initialScale = isMobile ? 0.45 : 0.65;
      const initialTransform = d3.zoomIdentity
        .translate(width / 2, height / 3) 
        .scale(initialScale);
      svg.call(zoomRef.current!.transform, initialTransform);
      setIsInitialRender(false);
    }

    const linksData = root.links();
    const links = g.selectAll<SVGPathElement, d3.HierarchyPointLink<ExtendedPerson>>('.link')
      .data(linksData, (d: any) => `${d.source.data.id}-${d.target.data.id}`);

    links.exit().remove();
    links.enter()
      .append('path')
      .attr('class', 'link')
      .merge(links as any)
      .transition().duration(500)
      .attr('d', (d: any) => `M${d.source.x},${d.source.y} C${d.source.x},${(d.source.y + d.target.y) / 2} ${d.target.x},${(d.source.y + d.target.y) / 2} ${d.target.x},${d.target.y}`)
      .attr('fill', 'none')
      .attr('stroke', theme.color)
      .attr('stroke-width', isMobile ? 4 : 6)
      .attr('opacity', 0.3);

    const nodesData = root.descendants();
    const nodes = g.selectAll<SVGGElement, d3.HierarchyPointNode<ExtendedPerson>>('.node')
      .data(nodesData, (d: any) => d.data.id);

    nodes.exit().remove();
    const nodesEnter = nodes.enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', (d: any) => `translate(${d.x}, ${d.y})`)
      .style('opacity', 0);

    const nodesMerged = nodesEnter.merge(nodes as any);
    nodesMerged.transition().duration(500)
      .attr('transform', (d: any) => `translate(${d.x}, ${d.y})`)
      .style('opacity', 1);

    const circleRadius = isMobile ? 50 : 70;
    const spouseXOffset = isMobile ? 90 : 130;
    const fontSizeMain = isMobile ? '28px' : '36px';
    const fontSizeLabel = isMobile ? '18px' : '22px';
    const fontSizeRole = isMobile ? '14px' : '16px';

    nodesMerged.each(function(d: any) {
      const nodeGroup = d3.select(this);
      nodeGroup.selectAll('*').remove();
      const isRevealed = d.data.isRevealed;

      if (d.data.spouse) {
        nodeGroup.append('line')
          .attr('x1', -spouseXOffset).attr('x2', spouseXOffset)
          .attr('y1', 0).attr('y2', 0)
          .attr('stroke', theme.color).attr('stroke-width', 4).attr('opacity', 0.4);
      }

      const drawCircle = (side: 'main' | 'spouse', x: number) => {
        const name = side === 'main' ? d.data.name : d.data.spouse;
        const gNode = nodeGroup.append('g')
          .attr('transform', `translate(${x}, 0)`)
          .on('click', (e) => handleNodeClick(e, d, side))
          .style('cursor', 'pointer');

        const hasChildren = (d.data.children && d.data.children.length > 0) || (d.data._children && d.data._children.length > 0);

        gNode.append('circle')
          .attr('r', circleRadius)
          .attr('fill', isRevealed ? (hasChildren ? theme.bg : '#1e293b') : '#0f172a')
          .attr('stroke', isRevealed ? theme.color : '#475569')
          .attr('stroke-width', 4)
          .attr('class', 'node-circle shadow-xl');

        // Logic for Text Tag inside the circle
        let nodeTag = '?';
        if (isRevealed) {
            if (side === 'main') {
                if (d.data.role === 'S') nodeTag = 'S';
                else if (d.data.role === 'D') nodeTag = 'D';
                else if (d.data.role === 'Root') nodeTag = 'R';
                else nodeTag = name ? name.charAt(0) : '?';
            } else {
                if (d.data.spouseRole === 'W') nodeTag = 'W';
                else if (d.data.spouseRole === 'H') nodeTag = 'H';
                else nodeTag = name ? name.charAt(0) : '?';
            }
        }

        gNode.append('text')
          .attr('dy', '0.35em').attr('text-anchor', 'middle')
          .attr('fill', 'white')
          .attr('font-size', fontSizeMain)
          .attr('font-weight', '900')
          .attr('pointer-events', 'none')
          .style('text-shadow', '0 2px 4px rgba(0,0,0,0.5)')
          .text(nodeTag);

        if (hasChildren && side === 'main') {
           gNode.append('circle')
            .attr('cy', circleRadius + 15)
            .attr('r', 8)
            .attr('fill', d.data.children ? theme.color : '#64748b');
        }
      };

      drawCircle('main', d.data.spouse ? -spouseXOffset : 0);
      if (d.data.spouse) drawCircle('spouse', spouseXOffset);

      if (isRevealed) {
        const labelText = d.data.spouse ? `${d.data.name} & ${d.data.spouse}` : d.data.name;
        
        let displayRole = d.data.role || 'Descendant';
        // Map short codes to full role names for the text label below the node
        if (displayRole === 'S') displayRole = 'Son';
        else if (displayRole === 'D') displayRole = 'Daughter';
        else if (displayRole === 'Root') displayRole = 'Root Ancestor';

        // Calculated offsets for spacing control
        // Increase space between Node and Role
        const roleYOffset = circleRadius + (isMobile ? 50 : 65);
        // Decrease space between Role and Name
        const nameYOffset = roleYOffset + (isMobile ? 22 : 28);

        // Role Label - Positioned ABOVE name (Just below node)
        nodeGroup.append('text')
          .attr('dy', roleYOffset)
          .attr('text-anchor', 'middle')
          .attr('fill', '#60a5fa')
          .attr('font-size', fontSizeRole)
          .attr('font-weight', '700')
          .text(displayRole);

        // Name Label - Positioned BELOW role
        nodeGroup.append('text')
          .attr('dy', nameYOffset)
          .attr('text-anchor', 'middle')
          .attr('fill', '#f1f5f9')
          .attr('font-size', fontSizeLabel)
          .attr('font-weight', '800')
          .style('text-shadow', '0 2px 4px rgba(0,0,0,0.8)')
          .text(labelText);
      }
    });
  }, [rootData, isInitialRender, centerNode]);

  const handleNodeClick = useCallback(async (event: any, d: d3.HierarchyPointNode<ExtendedPerson>, side: 'main' | 'spouse' = 'main') => {
    event.stopPropagation();
    
    // Toggle Children
    if (d.data.children) {
      // Collapse
      d.data._children = d.data.children;
      d.data.children = null;
    } else if (d.data._children) {
      // Expand
      d.data.children = d.data._children;
      d.data._children = null;
      
      // Reveal the clicked node (just in case)
      d.data.isRevealed = true;
      
      // Auto-reveal all children so their names appear immediately
      if (d.data.children) {
          d.data.children.forEach(child => {
              child.isRevealed = true;
          });
      }

      // Close siblings to keep tree clean
      if (d.parent && d.parent.children) {
         d.parent.children.forEach((siblingNode) => {
           const sibling = siblingNode.data;
           if (sibling.id !== d.data.id && sibling.children) {
             sibling._children = sibling.children;
             sibling.children = null;
           }
         });
      }
    }

    setRootData({ ...rootData });
    setSelectedNode(d.data);
    setIsSpouseSelected(side === 'spouse');
    setAiInsight('');
    
    // Zoom to a readable scale, not too close (Reduced from 1.3 to 0.9)
    centerNode(d.x, d.y, 0.9);

    setLoadingAi(true);
    const targetName = side === 'spouse' ? d.data.spouse : d.data.name;
    const targetRole = side === 'spouse' ? d.data.spouseRole : d.data.role;
    if (targetName) {
      try {
        const bio = await generateNodeBio(targetName, targetRole || '', 'family');
        setAiInsight(bio);
      } catch (err: any) {
        setAiInsight("History record available in archives.");
      }
    }
    setLoadingAi(false);
  }, [type, centerNode, rootData]);

  useEffect(() => {
    renderTree();
    const resizeObserver = new ResizeObserver(() => renderTree());
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [renderTree, rootData]);

  const displayPerson = isSpouseSelected 
    ? { name: selectedNode?.spouse, urduName: '', image: selectedNode?.spouseImage }
    : { name: selectedNode?.name, urduName: selectedNode?.urduName, image: selectedNode?.image };

  return (
    <div className="w-full h-full relative overflow-hidden bg-[radial-gradient(circle_at_center,_#0f172a_0%,_#020617_100%)]">
      <div ref={containerRef} className="absolute inset-0 w-full h-full">
        <svg ref={svgRef} className="w-full h-full cursor-grab active:cursor-grabbing" style={{ touchAction: 'none' }} />
      </div>
      
      {/* Controls */}
      <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 flex flex-col gap-3 z-10 pointer-events-auto">
        <button 
          onClick={jumpToTop} 
          className="w-12 h-12 flex items-center justify-center glass rounded-2xl border border-white/10 text-blue-400 hover:bg-blue-600 hover:text-white transition-all shadow-xl bg-slate-900/80"
          title="Jump to Top"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
        </button>
        <button 
          onClick={jumpToBottom} 
          className="w-12 h-12 flex items-center justify-center glass rounded-2xl border border-white/10 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all shadow-xl bg-slate-900/80"
          title="Jump to Bottom"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
        </button>
      </div>

      {/* Detail Panel */}
      {selectedNode && (
        <div className="absolute right-0 top-0 bottom-0 md:w-[400px] w-full pointer-events-none flex flex-col justify-end md:justify-start">
          
          {/* Desktop Close Button - Positioned absolutely within the panel wrapper, independent of scrolling */}
          <div className="hidden md:block absolute top-4 right-4 z-50 pointer-events-auto">
              <button 
                onClick={() => setSelectedNode(null)} 
                className="p-2 bg-black/40 hover:bg-red-500/80 text-slate-400 hover:text-white rounded-full transition-all backdrop-blur-md border border-white/10 shadow-lg"
                title="Close Details"
              >
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
          </div>

          <div className="pointer-events-auto bg-slate-900/95 md:bg-slate-900/80 backdrop-blur-xl border-t md:border-l border-white/10 h-[50vh] md:h-full p-6 overflow-y-auto flex flex-col gap-6 rounded-t-3xl md:rounded-none shadow-2xl transition-transform duration-500">
             
             <div className="md:hidden flex justify-center pb-2">
                <div className="w-12 h-1.5 bg-slate-700 rounded-full"></div>
             </div>

             <div className="flex justify-between items-start md:hidden">
                <h3 className="text-xl font-black text-white">{displayPerson.name}</h3>
                <button onClick={() => setSelectedNode(null)} className="p-2 text-slate-400 hover:text-white"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
             </div>

             <div className="w-full aspect-square rounded-2xl overflow-hidden border-2 border-slate-700 bg-slate-800 shadow-xl shrink-0 max-h-64 md:max-h-80 mx-auto">
               <img src={displayPerson.image || `https://picsum.photos/seed/${displayPerson.name}/400/400`} className="w-full h-full object-cover" alt={displayPerson.name} />
             </div>

             <div className="space-y-4">
                <div className="hidden md:block text-center md:text-left">
                    <h3 className="text-3xl font-black text-white leading-tight">{displayPerson.name}</h3>
                    {displayPerson.urduName && (
                        <p className="text-2xl font-serif text-blue-400 rtl leading-tight mt-2">{displayPerson.urduName}</p>
                    )}
                </div>

                <div className="p-5 bg-black/40 rounded-2xl border border-white/5 text-sm text-slate-300 leading-relaxed">
                   <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-3 border-b border-white/5 pb-2">Archives Insight</h4>
                   {loadingAi ? (
                       <div className="animate-pulse space-y-2">
                           <div className="h-2 bg-slate-700 rounded w-3/4"></div>
                           <div className="h-2 bg-slate-700 rounded"></div>
                       </div>
                   ) : (
                       <p>{aiInsight || "No record available."}</p>
                   )}
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TreeVisualizer;
