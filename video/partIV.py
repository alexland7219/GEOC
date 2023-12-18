from manim import *

def compEdges(nodes, edges):
    return [Arrow(nodes[i].get_center(), nodes[j].get_center(), color=BLACK, max_tip_length_to_length_ratio=0, buff=0.2) for (i, j) in edges]

def compNodes(nodes, color, radi=0.1):
    return [Dot(color=color, radius=radi, point=x[0]*RIGHT + x[1]*UP) for x in nodes]

def compArrows(nodes, edges, color, buf):
    return [Arrow(nodes[i].get_center(), nodes[j].get_center(), color=color, max_tip_length_to_length_ratio=0.3, buff=buf) for (i, j) in edges]


class ConvexHull(Scene):
    def getSquare(self, text, color, pos, height=15, textcolor=WHITE):
        content = Text(text, color=textcolor, font="DejaVu Sans Mono").scale(0.4).move_to(pos)

        square = Rectangle(color=color, width=15, height=height)
        square.set_fill(color, opacity=1)

        square.surround(content, buff=0.2)
        self.play(*[Create(square), Create(content)])

        return square, content


    def construct(self):
        self.camera.background_color = "#F9F2E5"

        intro = Text("IV. DISTRIBUTED CONVEX HULL", color=BLACK, font="DejaVu Sans Mono").scale(0.7).move_to(0.5*UP)
        intro2 = Text("Geometrical Network", color=BLACK, font="DejaVu Sans Mono").scale(0.5).move_to(0.5*DOWN)

        self.play(Create(intro))
        self.play(Create(intro2))
        self.wait(1)
        self.play(FadeOut(intro2))

        self.play(FadeOut(intro))

        self.wait(1)

        plane = NumberPlane(x_range=[-10,10,0.3], y_range=[-10, 10, 0.3], x_length=50, y_length=50, faded_line_style={'stroke_width': 0},
                        x_axis_config=dict(stroke_width=0), y_axis_config=dict(stroke_width=0), background_line_style=dict(stroke_opacity=0.35))

        self.add(plane)

        self.wait(2)

        nodesB = [(2.46, 2.73), (3.55, 1.69), (2.6, -0.5), (0.81, 1.38), (0.8, -0.13), (1.5,2),
                 (2.42, 1.56), (1.71, 0.80), (2.5,0.5), (0.3, 2.3)]
        nodesB = [(n[0]-1.5, n[1]-1) for n in nodesB]
        nodesB = [(2*x, 2*y) for x, y in nodesB]
        nodesB = [(n[0]+2.3, n[1]-0.4) for n in nodesB]

        nodes = compNodes(nodesB, BLACK)
        edges = [(0,1), (5,0), (9,3), (3,5), (6,5), (7,6), (1,8), (3,4), (4,7), (8,7), (2,7), (2,8), (7,5), (6,0), (6,1), (4,2), (9,5), (3,7), (8,6)]
        edges = compEdges(nodes, edges)

        self.play(*[Create(x) for x in nodes])
        self.play(*[Create(e) for e in edges])
        self.wait(2)

        text0 = Tex(r"\textbf{Convex Hull} steps", font_size=120, color=BLACK).scale(0.3).move_to(4.3*LEFT+3*UP)

        self.play(Create(text0))
        self.wait(1)

        stepName = Text("1. ELECT A LEADER", color=BLACK, font="DejaVu Sans Mono").scale(0.4).move_to(4.5*LEFT+2*UP)

        square = Rectangle(color=0xffef00, width=80, height=15)
        square.set_fill(0xffef00, opacity=1)

        square.surround(stepName, buff=0.2)

        self.play(Create(square))
        self.play(Create(stepName))

        # leader node
        leader_node = (4.5, -3.4)
        leader_node = compNodes([leader_node], 0xff007f, radi=0.17)[0]
        leader_node.z_index=-2

        self.play(Create(leader_node))

        setupAlg = [Tex(r"Run leader election. Let $\alpha$ be elected.", font_size=120, color=BLACK).scale(0.3).move_to(3.3*LEFT+1*UP)]
        self.play(*[Create(x) for x in setupAlg])

        alpha = Tex(r"$\alpha$", font_size=120, color=BLACK).scale(0.3).move_to(nodes[2].get_center() + 0.5*RIGHT)
        self.play(Create(alpha))

        self.wait(2)

        self.play(*[Uncreate(x) for x in setupAlg])
        self.play(Uncreate(square))
        self.play(Uncreate(stepName))


        stepName = Text("EXTERNAL FACE DETECTION", color=WHITE, font="DejaVu Sans Mono").scale(0.4).move_to(4.5*LEFT+2*UP)

        square = Rectangle(color=0x8b008b, width=80, height=10)
        square.set_fill(0x8b008b, opacity=1)

        square.surround(stepName, buff=0.2)

        self.play(Create(square))
        self.play(Create(stepName))
        self.wait(2)

        setupAlg = [Tex(r"Node $\alpha$ dominates no-one else.", font_size=120, color=BLACK).scale(0.3).move_to(4.2*LEFT + UP),
        Tex(r"Node $\alpha$ starts an external angular walk.", font_size=120, color=BLACK).scale(0.3).move_to(3.4*LEFT + 0.5*UP),
                Tex(r"Messages are \textbf{forwarded} around.", font_size=120, color=BLACK).scale(0.3).move_to(3.7*LEFT +0.5*DOWN),
                Tex(r"Nodes are renamed $\alpha_i$.", font_size=120, color=BLACK).scale(0.3).move_to(4.6*LEFT +DOWN)]
        self.play(*[Create(x) for x in setupAlg])
        self.wait(2)

        ## Walk
        arrows = [compArrows(nodes, [(2,4)], 0x483d8b, 0.11)[0]]
        bgNodes =[nodesB[4]]
        bgNodes[-1] = compNodes([bgNodes[-1]], 0xffa812, radi=0.17)[0]
        bgNodes[-1].z_index=-2

        names = [Tex(r"$\alpha_2$", font_size=120, color=BLACK).scale(0.3).move_to(nodes[4].get_center() + 0.5*LEFT)]

        self.play(Create(arrows[-1]))
        self.play(Create(bgNodes[-1]))
        self.play(Create(names[-1]))

        def determinePos(n):
            if n == 3:
                return 0.5*LEFT
            elif n == 5 or n == 9 or n == 0:
                return 0.5*UP
            elif n == 1:
                return 0.5*DOWN
            else:
                return 0.5*RIGHT

        #self.wait(0.8)
        for i, (x,y) in enumerate([(4,3), (3,9), (9,5), (5,0), (0,1), (1,8), (8,2)]):

            arrows.append(compArrows(nodes, [(x,y)], 0x483d8b, 0.11)[0])
            bgNodes.append(nodesB[y])
            bgNodes[-1] = compNodes([bgNodes[-1]], 0xffa812, radi=0.17)[0]
            bgNodes[-1].z_index=-2

            if i != 6:
                names.append(Tex("$\\alpha_{}$".format(i+3), font_size=120, color=BLACK).scale(0.3).move_to(nodes[y].get_center() + determinePos(y)))
                self.play(*[Create(arrows[-1]), Create(bgNodes[-1]), Create(names[-1])])

            else:
                self.play(*[Create(arrows[-1])])

        self.play(Uncreate(alpha))
        names.append(Tex("$\\alpha_{}$".format(1), font_size=120, color=BLACK).scale(0.3).move_to(nodes[2].get_center() + 0.5*RIGHT))
        self.play(Create(names[-1]))
        self.wait(2)

        setupAlg2 = [Tex(r"Internal nodes can shutdown.", font_size=120, color=BLACK).scale(0.3).move_to(4*LEFT + 2*DOWN)]

        self.play(*[Create(x) for x in setupAlg2])
        self.wait(2)

        self.play(*[Uncreate(x) for x in nodes[6:8]])
        self.play(*[Uncreate(e) for e in [edges[v] for v in [3, 4, 5, 8, 9, 10, 12, 13, 14, 17, 18]]])

        self.play(*[Uncreate(x) for x in setupAlg2])
        self.play(*[Uncreate(x) for x in setupAlg])
        self.play(*[Uncreate(x) for x in arrows])

        self.wait(2)

        self.play(Uncreate(stepName))

        self.play(Uncreate(square))


        stepName = Text("RECURSIVE MERGE", color=WHITE, font="DejaVu Sans Mono").scale(0.4).move_to(4.5*LEFT+2*UP)

        square = Rectangle(color=0x483c32, width=80, height=10)
        square.set_fill(0x483c32, opacity=1)

        square.surround(stepName, buff=0.4)

        self.play(Create(square))
        self.play(Create(stepName))
        self.wait(2)


        setupAlg = [Tex(r"Recursively compute convex hulls.", font_size=120, color=BLACK).scale(0.3).move_to(3.7*LEFT + UP),
        Tex(r"$C_1 = \mathcal{CH}(S_1 = \{\alpha_1, \dots, \alpha_{\lfloor \frac{n}{2} \rfloor}\}$.", font_size=120, color=BLACK).scale(0.3).move_to(3.8*LEFT),
                Tex(r"$C_2 = \mathcal{CH}(S_2 = \{\alpha_{\lfloor \frac{n}{2} \rfloor}, \dots, \alpha_n\}$.", font_size=120, color=BLACK).scale(0.3).move_to(3.8*LEFT +0.5*DOWN)]
        self.play(*[Create(x) for x in setupAlg])
        self.wait(2)

        C1pos = [nodes[i].get_center() for i in [2, 4, 9]]
        C1pol = Polygon(*C1pos, color=0x26619c, fill_opacity=0.5, stroke_width=0)

        C2pos = [nodes[i].get_center() for i in [9, 0, 1, 8]]
        C2pol = Polygon(*C2pos, color=0xa50b5e, fill_opacity=0.5, stroke_width=0)

        self.play(Create(C1pol))
        self.play(Create(C2pol))

        self.wait(2)

        setupAlg2 = [Tex(r"If $C_1$ and $C_2$ intersect at a single point, it's $\alpha_{\lfloor \frac{n}{2} \rfloor}$.", font_size=100, color=BLACK).scale(0.3).move_to(3.2*LEFT + 1.5*DOWN),
        Tex(r"If they don't intersect, then $C_1 \subset C_2$ or $C_2 \subset C_1$.", font_size=100, color=BLACK).scale(0.3).move_to(3.3*LEFT + 2*DOWN)]
        self.play(*[Create(x) for x in setupAlg2])
        self.wait(2)

        ## RAY ANIMATIONS

        for (i, o) in [(9,0), (0,1), (1,8)]:
            ray = Line(start=nodes[i].get_center(), end=nodes[o].get_center(), color=0x480607)
            ray.set_length(100)

            nodo = compNodes([nodesB[i]], 0x9400d3, radi=0.17)[0]
            nodo.z_index = -1
            self.play(Create(nodo))
            # Play the scene
            self.play(Write(ray))
            self.wait(0.5)

            self.play(Uncreate(ray))
            self.play(Uncreate(nodo))

        nodo = compNodes([nodesB[1]], 0xff007f, radi=0.17)[0]
        nodo.z_index = -1
        self.play(Create(nodo))

        self.wait(2)

        c_pos = [nodes[i].get_center() for i in [2, 4, 9, 0, 1]]
        c_pol = Polygon(*c_pos, color=0xfba0e3, fill_opacity=0.5, stroke_width=0)

        self.play(Create(c_pol))

        self.wait(2)

        self.play(*[Uncreate(x) for x in setupAlg2])

        setupAlg2 = [Tex(r"$C_1$ and $C_2$ might intersect twice.", font_size=100, color=BLACK).scale(0.3).move_to(3.2*LEFT + 1.5*DOWN),
        Tex(r"Detect interesections by sending line info.", font_size=100, color=BLACK).scale(0.3).move_to(3.3*LEFT + 2*DOWN)]
        self.play(*[Create(x) for x in setupAlg2])
        self.wait(2)

